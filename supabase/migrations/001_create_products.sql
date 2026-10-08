-- ========================================================================
-- J.K. Industries — Industrial Machinery Database Schema
-- Supabase Migration: 001_create_products.sql
-- ========================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('automatic', 'manual')),
  category_label TEXT,
  index_number TEXT,
  index_label TEXT,
  model_code TEXT,
  description TEXT,
  short_description TEXT,
  badge TEXT,
  technical_highlight TEXT,
  highlight_text TEXT,
  application_scope TEXT,
  specs JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Product Images Table
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================================

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Public users can only read active products
CREATE POLICY "Public users can view active products"
  ON public.products FOR SELECT
  USING (is_active = true);

-- Public users can view images of active products
CREATE POLICY "Public users can view product images"
  ON public.product_images FOR SELECT
  USING (true);

-- Authenticated admins have full CRUD rights on products
CREATE POLICY "Admins have full access to products"
  ON public.products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated admins have full CRUD rights on product images
CREATE POLICY "Admins have full access to product images"
  ON public.product_images FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ========================================================================
-- SEED DATA (All 10 Verified J.K. Industries Machines)
-- ========================================================================

INSERT INTO public.products (
  slug, name, category, index_number, index_label, model_code,
  description, short_description, badge, technical_highlight,
  highlight_text, application_scope, specs, sort_order
)
VALUES
  (
    'flatbed-label-printing-machine',
    'Flatbed Label Printing Machine',
    'automatic',
    '01',
    '01 / AUTOMATIC CONVERTING',
    'JKI-FPM-01',
    'Multi-station label printing and converting with precision servo control, web tension regulation, and flatbed impression system. Servo-driven mechanical indexing with digital web registration.',
    'Multi-station label printing and converting with precision servo control, web tension regulation, and flatbed impression system.',
    'SERVO MONOBLOCK',
    '■ MULTI-STATION SERIES',
    'Servo-driven mechanical indexing with digital web registration',
    'Label printing, packaging converting, textile garment labels',
    '[{"label": "Substrate Capability", "value": "Self-adhesive rolls, fabric, ribbon"}, {"label": "Drive Mechanism", "value": "Digital AC Servo Synchronized"}, {"label": "Control Interface", "value": "Industrial Touchscreen HMI + PLC"}, {"label": "Feed Regulation", "value": "Closed-loop pneumatic brake tensioner"}]'::jsonb,
    1
  ),
  (
    'label-ultrasonic-cutting-machine',
    'Label Ultrasonic Cutting Machine',
    'automatic',
    '02',
    '02 / AUTOMATIC ULTRASONIC FINISHING',
    'JKI-UCM-02',
    'High-frequency ultrasonic generator paired with a titanium alloy sonotrode horn. Produces soft, sealed edges on polyester, satin, and woven taffeta labels with zero fraying, zero heat burning, and programmable cut-length registration.',
    'Rotary and ultrasonic cutting unit for woven and printed labels, offering sealed edge finish without fraying.',
    'ROTARY ANVIL',
    '■ HIGH PRECISION ANVIL',
    'High-Freq Sonotrode Horn with titanium alloy construction',
    'Polyester labels, satin ribbons, woven taffeta',
    '[{"label": "System", "value": "High-Freq Sonotrode Horn"}, {"label": "Edge Finish", "value": "Zero-Fray Thermal Seal"}, {"label": "Ultrasonic Freq", "value": "20 KHZ / 35 KHZ"}, {"label": "Output Rate", "value": "Up to 300 pcs/min"}]'::jsonb,
    2
  ),
  (
    'tape-roll-screen-printing-machine',
    'Tape Roll Screen Printing Machine',
    'automatic',
    '03',
    '03 / CONTINUOUS TAPE PRINTING',
    'JKI-TSP-03',
    'Engineered for elastic webbing, twill tape, grosgrain, and high-tenacity ribbon rolls. Constant web-guiding and pneumatic squeegee pressure guarantee uniform ink penetration even across deep ribbed textiles.',
    'Specialized roll-to-roll screen printing unit for adhesive tapes, garment ribbons, and flexible substrate rolls with unified curing track.',
    'ROLL FEED SCREEN',
    '■ CONTINUOUS ROLL SYSTEM',
    'Pneumatic squeegee with constant web-guiding system',
    'Elastic webbing, twill tape, grosgrain, ribbon rolls',
    '[{"label": "Drive", "value": "Integrated Unwind / Rewind"}, {"label": "Substrate", "value": "Adhesive Tapes, Ribbons"}, {"label": "Tape Width Range", "value": "10 mm to 120 mm"}, {"label": "Cure Inline", "value": "Tunnel Dryer Integration"}]'::jsonb,
    3
  ),
  (
    'flatbed-screen-printing-machine',
    'Flatbed Screen Printing Machine',
    'automatic',
    '04',
    '04 / FLAT SHEET SCREEN',
    'JKI-FSP-04',
    'High-precision flatbed unit engineered for rigid sheets, plastic cards, stickers, and cut garment panels with micro-registration controls and vacuum hold-down table.',
    'High-precision flatbed unit engineered for rigid sheets, plastic cards, stickers, and cut garment panels with micro-registration controls.',
    'VACUUM BED',
    '■ PRECISION REGISTRATION',
    'Micro-metric registration with high-suction vacuum hold table',
    'Stickers, graphic panels, rigid sheet printing',
    '[{"label": "Table Type", "value": "Honeycomb Aluminum Vacuum"}, {"label": "Print Stroke", "value": "Variable Servo Stroke Speed"}]'::jsonb,
    4
  ),
  (
    'tag-card-counting-machine',
    'Tag/Card Counting Machine',
    'automatic',
    '05',
    '05 / AUTOMATIC COUNTING',
    'JKI-TCC-05',
    'Optical sensor batch counter for paper tags, cards, and garment packaging with high-speed automated stacking and programmable batch grouping.',
    'Optical sensor batch counter for paper tags, cards, and garment packaging with high-speed automated stacking and programmable batch grouping.',
    'OPTICAL SENSOR',
    '■ HIGH SPEED BATCHING',
    'High-speed optical sensor with programmable batch gate',
    'Hangtags, paper cards, swing tickets, packaging inserts',
    '[{"label": "Sensor Type", "value": "Dual Opto-Electronic Matrix"}, {"label": "Speed", "value": "Up to 1200 units / min"}]'::jsonb,
    5
  ),
  (
    'screen-printing-machine',
    'Screen Printing Machine',
    'manual',
    '06',
    '06 / MANUAL SCREEN PRINTING',
    'JKI-MSP-06',
    'Heavy-duty cast aluminum manual printing frame with balanced counterweights, micro-registration screws, and rigid clamping table for small-batch garment trims and cut pieces.',
    'Sturdy manual table frame unit for garment trims and screen printing operations with balanced counterweight and micro-registration adjustments.',
    'BALANCED FRAME',
    '■ SOLID ALUMINUM CAST HEAD',
    'Counterweighted frame head with micro-registration knobs',
    'Sampling, small-batch ribbons, garment labels, trims',
    '[{"label": "Head Action", "value": "Counterweighted Spring Pivot"}, {"label": "Registration", "value": "3-Axis Precision Micrometer"}]'::jsonb,
    6
  ),
  (
    'die-cutting-machine',
    'Die Cutting Machine',
    'manual',
    '07',
    '07 / HEAVY PLATEN CUTTING',
    'JKI-DCM-07',
    'Manual and semi-automatic platen die cutting press for leather labels, tag boards, heat-seal patches, and packaging blanks with mechanical toggle pressure.',
    'Rigid platen manual cutting station suitable for hangtags, adhesive label sheets, and light packaging converting.',
    'TOGGLE PLATEN',
    '■ DUAL FLYWHEEL DRIVE',
    'Mechanical toggle mechanism generating high platen tonnage',
    'Hangtags, paperboard blanks, foam gaskets, label sheets',
    '[{"label": "Platen Construction", "value": "Stress-Relieved Ductile Cast Iron"}, {"label": "Stroke Adjustment", "value": "Eccentric Manual Wedge"}]'::jsonb,
    7
  ),
  (
    'bopp-core-cutting-machine',
    'BOPP Core Cutting Machine',
    'manual',
    '08',
    '08 / ROTARY TUBE SLITTING',
    'JKI-CCM-08',
    'Accurate circular blade manual paper and plastic core cutting unit for adhesive tape and film rolls with calibrated length stop scale.',
    'Accurate circular blade manual paper and plastic core cutting unit for adhesive tape and film rolls with calibrated length stop scale.',
    'ROTARY ALLOY BLADE',
    '■ MANUAL PLUNGE ARM',
    'Self-sharpening circular alloy blade with metric length stopper',
    'Slitting paper cores, BOPP plastic tube cores, textile tubes',
    '[{"label": "Blade Spec", "value": "Hardened High-Carbon Rotary Disc"}, {"label": "Length Setting", "value": "Adjustable Anodized Rule Stop"}]'::jsonb,
    8
  ),
  (
    'roll-to-roll-winding-machine',
    'Roll to Roll Winding Machine',
    'manual',
    '09',
    '09 / ROLL CONVERTING & INSPECTION',
    'JKI-RWM-09',
    'Mechanical roll unwinding and rewinding station equipped with manual web-guide adjusters, pneumatic expansion chucks, and tension brake assembly.',
    'Continuous roll rewinding, slitting inspection, and spool preparation unit with adjustable mechanical tension brake.',
    'TENSION BRAKE',
    '■ AIR EXPANDING SHAFT',
    'Torque regulated reeler with pneumatic expansion mandrel',
    'Tape inspection, woven ribbon batching, paper rolls',
    '[{"label": "Shaft System", "value": "Pneumatic Expanding Lug Mandrel"}, {"label": "Brake System", "value": "Manual Friction Caliper Assembly"}]'::jsonb,
    9
  ),
  (
    'label-winding-machine',
    'Label Winding Machine',
    'manual',
    '10',
    '10 / BENCHTOP SPOOLING',
    'JKI-LWM-10',
    'Compact benchtop motorized roll winder with bi-directional rotation, mechanical core tension adaptor, and smooth speed regulator.',
    'Compact benchtop motorized roll winder with bi-directional rotation, mechanical core tension adaptor, and smooth speed regulator.',
    'BI-DIRECTIONAL',
    '■ VARIABLE SPEED REGULATOR',
    'Bi-directional counter with automated stop',
    'Labels, ribbons, narrow-web spooling',
    '[{"label": "Rotation", "value": "Dual Mode Forward / Reverse"}, {"label": "Tension Adaptor", "value": "Adjustable Mechanical Core"}]'::jsonb,
    10
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  index_number = EXCLUDED.index_number,
  index_label = EXCLUDED.index_label,
  model_code = EXCLUDED.model_code,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  badge = EXCLUDED.badge,
  technical_highlight = EXCLUDED.technical_highlight,
  highlight_text = EXCLUDED.highlight_text,
  application_scope = EXCLUDED.application_scope,
  specs = EXCLUDED.specs,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

-- ========================================================================
-- 5. SEED ADMIN USER (jkindustries1905@gmail.com)
-- ========================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  v_user_id UUID := gen_random_uuid();
  v_email TEXT := 'jkindustries1905@gmail.com';
  v_password TEXT := 'jkindustries1905@gmail.com';
  existing_id UUID;
BEGIN
  SELECT id INTO existing_id FROM auth.users WHERE email = v_email;

  IF existing_id IS NULL THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      v_email,
      crypt(v_password, gen_salt('bf', 10)),
      NOW(),
      NOW(),
      NOW(),
      '{"provider": "email", "providers": ["email"]}'::jsonb,
      '{"name": "J.K. Industries Admin", "role": "admin"}'::jsonb,
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );

    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      v_user_id,
      v_user_id,
      format('{"sub": "%s", "email": "%s"}', v_user_id::text, v_email)::jsonb,
      'email',
      v_user_id::text,
      NOW(),
      NOW(),
      NOW()
    );
  ELSE
    UPDATE auth.users
    SET
      encrypted_password = crypt(v_password, gen_salt('bf', 10)),
      email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
      updated_at = NOW(),
      raw_app_meta_data = '{"provider": "email", "providers": ["email"]}'::jsonb,
      raw_user_meta_data = '{"name": "J.K. Industries Admin", "role": "admin"}'::jsonb
    WHERE id = existing_id;

    IF NOT EXISTS (SELECT 1 FROM auth.identities WHERE user_id = existing_id) THEN
      INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        last_sign_in_at,
        created_at,
        updated_at
      ) VALUES (
        existing_id,
        existing_id,
        format('{"sub": "%s", "email": "%s"}', existing_id::text, v_email)::jsonb,
        'email',
        existing_id::text,
        NOW(),
        NOW(),
        NOW()
      );
    END IF;
  END IF;
END $$;

