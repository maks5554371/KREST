/**
 * Migrationen als Code statt als .sql-Dateien: Turbopack bündelt den Server-Code,
 * sodass zur Laufzeit nicht garantiert ist, dass lose .sql-Dateien mitkopiert werden.
 *
 * Regeln: Migrationen sind unveränderlich. Änderungen kommen als neue Migration dazu.
 */
export interface Migration {
  id: string
  statements: string[]
}

export const migrations: Migration[] = [
  {
    id: '001_init',
    statements: [
      `CREATE TABLE categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT,
        sort_order INTEGER NOT NULL DEFAULT 0
      )`,
      `CREATE TABLE products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        brand TEXT,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        status TEXT NOT NULL DEFAULT 'draft',
        sort_order INTEGER NOT NULL DEFAULT 0,

        headline TEXT NOT NULL,
        card_summary TEXT NOT NULL,
        price_cents INTEGER,
        price_note TEXT,
        acquisition_json TEXT NOT NULL DEFAULT '[]',

        hero_image TEXT,
        hero_image_alt TEXT,
        gallery_json TEXT NOT NULL DEFAULT '[]',
        blocks_json TEXT NOT NULL DEFAULT '[]',
        specs_json TEXT NOT NULL DEFAULT '[]',
        faq_json TEXT NOT NULL DEFAULT '[]',
        downloads_json TEXT NOT NULL DEFAULT '[]',

        meta_title TEXT,
        meta_description TEXT,
        meta_keywords TEXT,

        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`,
      `CREATE INDEX idx_products_category ON products(category_id)`,
      `CREATE INDEX idx_products_status ON products(status)`,
      `CREATE INDEX idx_products_sort ON products(sort_order, name)`,
    ],
  },
  {
    id: '002_seed_categories',
    statements: [
      // Gerätekategorien aus dem Kundenbriefing.
      `INSERT INTO categories (slug, name, description, sort_order) VALUES
        ('diodenlaser', 'Diodenlaser', 'Diodenlaser zur dauerhaften Haarentfernung mit 3 oder 4 Wellenlängen.', 1),
        ('shr', 'SHR-Geräte', 'Super Hair Removal – schonende Haarentfernung für nahezu alle Hauttypen.', 2),
        ('ipl', 'IPL-Geräte', 'Intense Pulsed Light für Haarentfernung und Hautbildverbesserung.', 3),
        ('kryolipolyse', 'Kryolipolyse-Geräte', 'Nicht-invasive Fettreduktion durch kontrollierte Kälteanwendung.', 4),
        ('aquafacial', 'Aquafacial-Geräte', 'Tiefenreinigung, Peeling und Hydratation in einer Behandlung.', 5)`,
    ],
  },
]
