import type { Product } from '@/types/product';

/**
 * Central product catalogue for J.K. Industries.
 *
 * ADDING A NEW MACHINE:
 *   1. Add its image(s) to src/assets/machines/<category>/<slug>/
 *   2. Add one entry to this array
 *   That's it — no other files need editing.
 *
 * All product text is sourced directly from Stitch design content.
 * Do NOT invent specifications, certifications, or production numbers.
 */
export const products: Product[] = [
  /* ════════════════════════════════════════════════════════════════
     CATEGORY 01: AUTOMATIC MACHINES
     ════════════════════════════════════════════════════════════════ */
  {
    id: 'prod-01',
    slug: 'flatbed-label-printing-machine',
    name: 'Flatbed Label Printing Machine',
    category: 'automatic',
    categoryLabel: 'Automatic Machines',
    indexNumber: '01',
    indexLabel: '01 / AUTOMATIC CONVERTING',
    modelCode: 'JKI-FPM-01',
    description:
      'Multi-station label printing and converting with precision servo control, web tension regulation, and flatbed impression system. Servo-driven mechanical indexing with digital web registration.',
    shortDescription:
      'Multi-station label printing and converting with precision servo control, web tension regulation, and flatbed impression system.',
    badge: 'SERVO MONOBLOCK',
    technicalHighlight: '■ MULTI-STATION SERIES',
    highlightText: 'Servo-driven mechanical indexing with digital web registration',
    applicationScope: 'Label printing, packaging converting, textile garment labels',
    specs: [
      { label: 'Substrate Capability', value: 'Self-adhesive rolls, fabric, ribbon' },
      { label: 'Drive Mechanism', value: 'Digital AC Servo Synchronized' },
      { label: 'Control Interface', value: 'Industrial Touchscreen HMI + PLC' },
      { label: 'Feed Regulation', value: 'Closed-loop pneumatic brake tensioner' },
    ],
    sortOrder: 1,
  },
  {
    id: 'prod-02',
    slug: 'label-ultrasonic-cutting-machine',
    name: 'Label Ultrasonic Cutting Machine',
    category: 'automatic',
    categoryLabel: 'Automatic Machines',
    indexNumber: '02',
    indexLabel: '02 / AUTOMATIC ULTRASONIC FINISHING',
    modelCode: 'JKI-UCM-02',
    description:
      'High-frequency ultrasonic generator paired with a titanium alloy sonotrode horn. Produces soft, sealed edges on polyester, satin, and woven taffeta labels with zero fraying, zero heat burning, and programmable cut-length registration.',
    shortDescription:
      'Rotary and ultrasonic cutting unit for woven and printed labels, offering sealed edge finish without fraying.',
    badge: 'ROTARY ANVIL',
    technicalHighlight: '■ HIGH PRECISION ANVIL',
    highlightText: 'High-Freq Sonotrode Horn with titanium alloy construction',
    applicationScope: 'Polyester labels, satin ribbons, woven taffeta',
    specs: [
      { label: 'System', value: 'High-Freq Sonotrode Horn' },
      { label: 'Edge Finish', value: 'Zero-Fray Thermal Seal' },
      { label: 'Ultrasonic Freq', value: '20 KHZ / 35 KHZ' },
      { label: 'Output Rate', value: 'Up to 300 pcs/min' },
    ],
    sortOrder: 2,
  },
  {
    id: 'prod-03',
    slug: 'tape-roll-screen-printing-machine',
    name: 'Tape Roll Screen Printing Machine',
    category: 'automatic',
    categoryLabel: 'Automatic Machines',
    indexNumber: '03',
    indexLabel: '03 / CONTINUOUS TAPE PRINTING',
    modelCode: 'JKI-TSP-03',
    description:
      'Engineered for elastic webbing, twill tape, grosgrain, and high-tenacity ribbon rolls. Constant web-guiding and pneumatic squeegee pressure guarantee uniform ink penetration even across deep ribbed textiles.',
    shortDescription:
      'Specialized roll-to-roll screen printing unit for adhesive tapes, garment ribbons, and flexible substrate rolls with unified curing track.',
    badge: 'ROLL FEED SCREEN',
    technicalHighlight: '■ CONTINUOUS ROLL SYSTEM',
    highlightText: 'Pneumatic squeegee with constant web-guiding system',
    applicationScope: 'Elastic webbing, twill tape, grosgrain, ribbon rolls',
    specs: [
      { label: 'Drive', value: 'Integrated Unwind / Rewind' },
      { label: 'Substrate', value: 'Adhesive Tapes, Ribbons' },
      { label: 'Tape Width Range', value: '10 mm to 120 mm' },
      { label: 'Cure Inline', value: 'Tunnel Dryer Integration' },
    ],
    sortOrder: 3,
  },
  {
    id: 'prod-04',
    slug: 'flatbed-screen-printing-machine',
    name: 'Flatbed Screen Printing Machine',
    category: 'automatic',
    categoryLabel: 'Automatic Machines',
    indexNumber: '04',
    indexLabel: '04 / FLAT SHEET SCREEN',
    modelCode: 'JKI-FSP-04',
    description:
      'Heavy cast iron table with multi-zone vacuum bed designed for rigid sheet substrates, tags, cards, heat transfers, and high-density ink deposits.',
    shortDescription:
      'High-precision flatbed graphic screen printing machinery with programmable stroke, regulated pneumatic squeegee pressure, and vacuum suction bed.',
    badge: 'AUTO VACUUM BED',
    technicalHighlight: '■ VACUUM BED SYSTEM',
    highlightText: 'Multi-zone vacuum bed with pneumatic squeegee pressure',
    applicationScope: 'Tags, cards, heat transfers, rigid sheet substrates',
    specs: [
      { label: 'Stroke', value: 'Programmable Linear Cycle' },
      { label: 'Bed Type', value: 'Honeycomb Vacuum Suction' },
      { label: 'Max Bed Size', value: '500 x 700 mm' },
    ],
    sortOrder: 4,
  },
  {
    id: 'prod-05',
    slug: 'tag-card-counting-machine',
    name: 'Tag / Card Counting Machine',
    category: 'automatic',
    categoryLabel: 'Automatic Machines',
    indexNumber: '05',
    indexLabel: '05 / VERIFICATION & COUNT',
    modelCode: 'JKI-TCC-05',
    description:
      'High-speed batch dispensing and opto-electronic verification for finished paper hangtags, plastic cards, and heavy GSM die-cut garments tags. Eliminates human dispatch errors.',
    shortDescription:
      'Optical sensor automated high-speed batch counting and dispensing unit for hang tags, cards, and carton blanks with programmable batch stops.',
    badge: 'OPTICAL SENSING',
    technicalHighlight: '■ OPTO-ELECTRONIC',
    highlightText: 'Opto-electronic verification with batch dispensing',
    applicationScope: 'Hangtags, plastic cards, die-cut garment tags',
    specs: [
      { label: 'Detection', value: 'Dual Optical Fiber Sensor' },
      { label: 'Target', value: 'Hangtags, Cards, Inserts' },
      { label: 'Batching Speed', value: '1,200 tags / min' },
    ],
    sortOrder: 5,
  },
  /* ════════════════════════════════════════════════════════════════
     CATEGORY 02: MANUAL & CONVERTING UNITS
     ════════════════════════════════════════════════════════════════ */
  {
    id: 'prod-06',
    slug: 'roll-to-roll-winding-machine',
    name: 'Roll to Roll Winding Machine',
    category: 'manual',
    categoryLabel: 'Manual & Converting Units',
    indexNumber: '06',
    indexLabel: '06 / REWIND & SLIT PREP',
    modelCode: 'JKI-RWM-06',
    description:
      'Engineered for continuous tension-controlled rewinding, web inspection, and roll edge alignment across label stocks, coated films, and ribbons. Equipped with dual electromagnetic tension clutches.',
    shortDescription:
      'Heavy duty dual-shaft rewinding and tension-controlled inspection machine for label rolls and flexible films with magnetic particle tension regulation.',
    badge: 'DUAL SHAFT',
    technicalHighlight: '■ HEAVY DUTY UNWIND/REWIND',
    highlightText: 'Dual electromagnetic tension clutches with web inspection',
    applicationScope: 'Label stocks, coated films, ribbons',
    specs: [
      { label: 'Shaft Design', value: 'Pneumatic Expanding Mandrels' },
      { label: 'Control', value: 'Magnetic Powder Brake Clutch' },
      { label: 'Max Roll Dia', value: '600 mm' },
    ],
    sortOrder: 6,
  },
  {
    id: 'prod-07',
    slug: 'screen-printing-machine',
    name: 'Screen Printing Machine',
    category: 'manual',
    categoryLabel: 'Manual & Converting Units',
    indexNumber: '07',
    indexLabel: '07 / WORKBENCH',
    modelCode: 'JKI-SPM-07',
    description:
      'Manual counterbalanced table with micro-gauge four-point registration. Solid aluminum cast head for consistent print quality.',
    shortDescription:
      'Manual micro-registration precision screen printing press with balanced counterweight squeegee arm, fine vernier alignment, and cast bed.',
    badge: 'MICRO-REGISTRATION',
    technicalHighlight: '■ SOLID ALUMINUM CAST HEAD',
    highlightText: 'Four-point micro-gauge registration system',
    applicationScope: 'Workshop printing, precision registration jobs',
    specs: [
      { label: 'Alignment', value: 'X-Y-Z 3-Axis Micrometer' },
      { label: 'Balance', value: 'Dual Counterweight Springs' },
    ],
    sortOrder: 7,
  },
  {
    id: 'prod-08',
    slug: 'die-cutting-machine',
    name: 'Die Cutting Machine',
    category: 'manual',
    categoryLabel: 'Manual & Converting Units',
    indexNumber: '08',
    indexLabel: '08 / STAMP & CREASE',
    modelCode: 'JKI-DCM-08',
    description:
      'Manual & semi-rotary steel rule die punching for adhesive sticker sheets and card shapes. Cam-lever pressure tonnage for consistent cutting force.',
    shortDescription:
      'Robust platen die punching machine for heavy cardstock, label blanks, and gasket substrate materials with electromagnetic clutch safety system.',
    badge: 'PLATEN DIE SYSTEM',
    technicalHighlight: '■ CAM-LEVER PRESSURE TONNAGE',
    highlightText: 'Steel rule die punching with cam-lever pressure',
    applicationScope: 'Adhesive sticker sheets, card shapes, gaskets',
    specs: [
      { label: 'Platen Frame', value: 'Stress-Relieved Casting' },
      { label: 'Brake/Safety', value: 'Electromagnetic Trip Rail' },
    ],
    sortOrder: 8,
  },
  {
    id: 'prod-09',
    slug: 'bopp-core-cutting-machine',
    name: 'BOPP Core Cutting Machine',
    category: 'manual',
    categoryLabel: 'Manual & Converting Units',
    indexNumber: '09',
    indexLabel: '09 / CORE FINISHING',
    modelCode: 'JKI-CCR-09',
    description:
      'Rotary multi-knife slicer for standard paper and plastic cores (1", 1.5", 3" diameter). Burr-free rotating arbor ensures clean core cuts.',
    shortDescription:
      'Accurate circular blade manual paper and plastic core cutting unit for adhesive tape and film rolls with calibrated length stop scale.',
    badge: 'CIRCULAR BLADE',
    technicalHighlight: '■ BURR-FREE ROTATING ARBOR',
    highlightText: 'Multi-knife rotary slicer for standard cores',
    applicationScope: 'Paper cores, plastic cores, BOPP tape rolls',
    specs: [
      { label: 'Blade Material', value: 'Hardened High-Carbon Alloy' },
      { label: 'Core Capacity', value: 'Cardboard & Plastic BOPP' },
    ],
    sortOrder: 9,
  },
  {
    id: 'prod-10',
    slug: 'label-winding-machine',
    name: 'Label Winding Machine',
    category: 'manual',
    categoryLabel: 'Manual & Converting Units',
    indexNumber: '10',
    indexLabel: '10 / BENCHTOP SPOOLING',
    modelCode: 'JKI-LWM-10',
    description:
      'Benchtop bi-directional label counter with automated stop and core tensioning. Variable speed regulator for precise winding control.',
    shortDescription:
      'Compact benchtop motorized roll winder with bi-directional rotation, mechanical core tension adaptor, and smooth speed regulator.',
    badge: 'BI-DIRECTIONAL',
    technicalHighlight: '■ VARIABLE SPEED REGULATOR',
    highlightText: 'Bi-directional counter with automated stop',
    applicationScope: 'Labels, ribbons, narrow-web spooling',
    specs: [
      { label: 'Rotation', value: 'Dual Mode Forward / Reverse' },
      { label: 'Tension Adaptor', value: 'Adjustable Mechanical Core' },
    ],
    sortOrder: 10,
  },
];

/** Get all products sorted by sortOrder */
export function getAllProducts(): Product[] {
  return [...products].sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Get products by category */
export function getProductsByCategory(category: Product['category']): Product[] {
  return getAllProducts().filter((p) => p.category === category);
}

/** Get a single product by slug */
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/** Get category counts */
export function getCategoryCounts() {
  const all = getAllProducts();
  return {
    all: all.length,
    automatic: all.filter((p) => p.category === 'automatic').length,
    manual: all.filter((p) => p.category === 'manual').length,
  };
}
