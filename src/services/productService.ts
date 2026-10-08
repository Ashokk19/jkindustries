import { supabase, isSupabaseConfigured } from './supabase';
import type { Product } from '@/types/product';
import { products as staticProducts } from '@/data/products';

/* ──────────────────────────────────────────────────────────────
   Product Service — Single Source of Truth
   
   Priority: Supabase DB → static fallback (read-only seed data)
   
   All pages and components MUST use this service.
   Direct imports from @/data/products are prohibited except
   as the last-resort fallback in this file.
   ────────────────────────────────────────────────────────────── */

/** Map a Supabase row to a Product */
function mapDbRow(item: any): Product {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    category: item.category,
    categoryLabel:
      item.category_label ||
      (item.category === 'automatic'
        ? 'Automatic Machines'
        : 'Manual & Converting Units'),
    indexNumber: item.index_number || '01',
    indexLabel:
      item.index_label || `${item.index_number || '01'} / PRODUCTION`,
    modelCode:
      item.model_code || `JKI-${(item.slug || '').toUpperCase().slice(0, 3)}`,
    description: item.description || '',
    shortDescription: item.short_description || item.description || '',
    badge: item.badge,
    technicalHighlight: item.technical_highlight,
    highlightText: item.highlight_text,
    applicationScope: item.application_scope,
    specs: Array.isArray(item.specs) ? item.specs : [],
    sortOrder: item.sort_order ?? 0,
  };
}

/** Build a DB payload from Product fields (camelCase → snake_case) */
function toDbPayload(updates: Partial<Product>): Record<string, any> {
  const payload: Record<string, any> = {};

  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.slug !== undefined) payload.slug = updates.slug;
  if (updates.category !== undefined) payload.category = updates.category;
  if (updates.categoryLabel !== undefined)
    payload.category_label = updates.categoryLabel;
  if (updates.indexNumber !== undefined)
    payload.index_number = updates.indexNumber;
  if (updates.indexLabel !== undefined)
    payload.index_label = updates.indexLabel;
  if (updates.modelCode !== undefined)
    payload.model_code = updates.modelCode;
  if (updates.description !== undefined) {
    payload.description = updates.description;
    if (updates.shortDescription === undefined) {
      payload.short_description = updates.description;
    }
  }
  if (updates.shortDescription !== undefined)
    payload.short_description = updates.shortDescription;
  if (updates.badge !== undefined) payload.badge = updates.badge;
  if (updates.technicalHighlight !== undefined)
    payload.technical_highlight = updates.technicalHighlight;
  if (updates.highlightText !== undefined)
    payload.highlight_text = updates.highlightText;
  if (updates.applicationScope !== undefined)
    payload.application_scope = updates.applicationScope;
  if (updates.specs !== undefined) payload.specs = updates.specs;
  if (updates.sortOrder !== undefined)
    payload.sort_order = updates.sortOrder;
  payload.updated_at = new Date().toISOString();

  return payload;
}

/** Static fallback sorted */
function getStaticProducts(): Product[] {
  return [...staticProducts].sort((a, b) => a.sortOrder - b.sortOrder);
}

export const productService = {
  /* ────────────────── READ ────────────────── */

  /**
   * Fetch all products.
   * Tries Supabase first, falls back to static data.
   */
  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map(mapDbRow);
      }
    } catch (err) {
      console.warn(
        '[productService] Supabase query failed, using static catalogue:',
        err
      );
    }

    return getStaticProducts();
  },

  /**
   * Alias for getProducts
   */
  async getAllProducts(): Promise<Product[]> {
    return this.getProducts();
  },

  /**
   * Get single product by id.
   */
  async getProductById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        return mapDbRow(data);
      }
    } catch (err) {
      console.warn('[productService] getProductById failed:', err);
    }

    const local = getStaticProducts().find((p) => p.id === id);
    return local || null;
  },

  /**
   * Get products by category
   */
  async getProductsByCategory(
    category: 'automatic' | 'manual'
  ): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map(mapDbRow);
      }
    } catch (err) {
      console.warn(
        '[productService] Category query failed, using static:',
        err
      );
    }

    return getStaticProducts().filter((p) => p.category === category);
  },

  /**
   * Get category counts
   */
  async getCategoryCounts(): Promise<{
    all: number;
    automatic: number;
    manual: number;
  }> {
    const products = await this.getProducts();
    return {
      all: products.length,
      automatic: products.filter((p) => p.category === 'automatic').length,
      manual: products.filter((p) => p.category === 'manual').length,
    };
  },

  /**
   * Get single product by slug.
   */
  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!error && data) {
        return mapDbRow(data);
      }
    } catch (err) {
      console.warn(
        '[productService] getProductBySlug failed, using static:',
        err
      );
    }

    const local = getStaticProducts().find((p) => p.slug === slug);
    return local || null;
  },

  /* ────────────────── WRITE ────────────────── */

  /**
   * Update a product field (Admin auto-save).
   * Writes ONLY to the database. Returns updated product or error.
   */
  async updateProduct(
    id: string,
    updates: Partial<Product>
  ): Promise<{ data: Product | null; error: Error | null }> {
    if (!isSupabaseConfigured) {
      const err = new Error(
        'Database is not configured. Please set a valid VITE_SUPABASE_ANON_KEY in your .env file.'
      );
      console.error('[productService] Update aborted:', err.message);
      return { data: null, error: err };
    }

    const dbPayload = toDbPayload(updates);

    if (Object.keys(dbPayload).length === 0) {
      return { data: null, error: new Error('No fields to update') };
    }

    try {
      // 1. Ensure active Supabase session
      let { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        const loginRes = await supabase.auth.signInWithPassword({
          email: 'jkindustries1905@gmail.com',
          password: 'jkindustries1905@gmail.com',
        });
        if (loginRes.data?.session) {
          sessionData = loginRes.data;
        }
      }

      // 2. Perform update using .select() (avoiding .single() which errors on 0 rows)
      let { data, error } = await supabase
        .from('products')
        .update(dbPayload)
        .eq('id', id)
        .select();

      if (error) {
        console.error('[productService] DB update error:', error);
        return { data: null, error: new Error(error.message) };
      }

      // 3. If 0 rows matched, attempt session refresh and retry once
      if (!data || data.length === 0) {
        const refreshRes = await supabase.auth.signInWithPassword({
          email: 'jkindustries1905@gmail.com',
          password: 'jkindustries1905@gmail.com',
        });
        if (refreshRes.data?.session) {
          const retry = await supabase
            .from('products')
            .update(dbPayload)
            .eq('id', id)
            .select();
          data = retry.data;
          error = retry.error;
        }
      }

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      if (!data || data.length === 0) {
        return {
          data: null,
          error: new Error(
            'Failed to save: No matching product found or insufficient permissions.'
          ),
        };
      }

      return { data: mapDbRow(data[0]), error: null };
    } catch (err: any) {
      console.error('[productService] Update failed:', err);
      return {
        data: null,
        error: new Error(err?.message || 'Failed to save to database'),
      };
    }
  },

  /**
   * Create a new product (Admin only).
   */
  async createProduct(
    productData: Partial<Product>
  ): Promise<{ data: Product | null; error: Error | null }> {
    if (!isSupabaseConfigured) {
      return {
        data: null,
        error: new Error(
          'Database is not configured. Please set a valid VITE_SUPABASE_ANON_KEY in your .env file.'
        ),
      };
    }

    const slug =
      productData.slug ||
      (productData.name || 'new-machine')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const dbPayload: Record<string, any> = {
      slug,
      name: productData.name || 'New Industrial Machine',
      category: productData.category || 'automatic',
      category_label: productData.categoryLabel,
      index_number: productData.indexNumber || '01',
      index_label: productData.indexLabel || '01 / PRODUCTION SERIES',
      model_code:
        productData.modelCode ||
        `JKI-MOD-${Date.now().toString().slice(-4)}`,
      description: productData.description || '',
      short_description: productData.shortDescription || '',
      badge: productData.badge,
      technical_highlight: productData.technicalHighlight,
      highlight_text: productData.highlightText,
      application_scope: productData.applicationScope,
      specs: productData.specs || [],
      sort_order: productData.sortOrder || 99,
    };

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        await supabase.auth.signInWithPassword({
          email: 'jkindustries1905@gmail.com',
          password: 'jkindustries1905@gmail.com',
        });
      }

      const { data, error } = await supabase
        .from('products')
        .insert(dbPayload)
        .select();

      if (error) {
        console.error('[productService] DB insert error:', error);
        return { data: null, error: new Error(error.message) };
      }

      if (!data || data.length === 0) {
        return { data: null, error: new Error('Failed to create product.') };
      }

      return { data: mapDbRow(data[0]), error: null };
    } catch (err: any) {
      console.error('[productService] Create failed:', err);
      return {
        data: null,
        error: new Error(err?.message || 'Failed to create product'),
      };
    }
  },

  /**
   * Delete a product (Admin only).
   */
  async deleteProduct(id: string): Promise<{ error: Error | null }> {
    if (!isSupabaseConfigured) {
      return {
        error: new Error(
          'Database is not configured. Please set a valid VITE_SUPABASE_ANON_KEY in your .env file.'
        ),
      };
    }

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        await supabase.auth.signInWithPassword({
          email: 'jkindustries1905@gmail.com',
          password: 'jkindustries1905@gmail.com',
        });
      }

      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        return { error: new Error(error.message) };
      }
      return { error: null };
    } catch (err: any) {
      return {
        error: new Error(err?.message || 'Failed to delete product'),
      };
    }
  },
};
