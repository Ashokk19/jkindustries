/* Product types for J.K. Industries machinery catalogue */

export type MachineCategory = 'automatic' | 'manual';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: MachineCategory;
  categoryLabel: string;
  indexNumber: string;
  indexLabel: string;
  modelCode: string;
  description: string;
  shortDescription: string;
  badge?: string;
  technicalHighlight?: string;
  highlightText?: string;
  applicationScope?: string;
  specs: ProductSpec[];
  sortOrder: number;
}
