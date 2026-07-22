#!/usr/bin/env node
/**
 * Demo-Produkte für die lokale Entwicklung. Idempotent: löscht vorhandene
 * Datensätze mit gleichem Slug und legt sie neu an. Nutzt die Placeholder-
 * Bilder aus /public/images (echte Produktfotos kommen später über /admin).
 *
 *   node scripts/seed-demo-products.mjs
 *
 * Zum Entfernen: node scripts/seed-demo-products.mjs --clean
 */
import { createClient } from '@libsql/client'
import { resolve } from 'node:path'

const dbPath = resolve(process.cwd(), process.env.DATABASE_PATH || 'data/kret.db')
const db = createClient({ url: `file:${dbPath}` })

const IMG = {
  laser: '/images/service-verkauf.jpg',
  wartung: '/images/service-wartung.jpg',
  mobil: '/images/service-mobil.jpg',
  miete: '/images/service-miete.jpg',
  beratung: '/images/service-beratung.jpg',
  reparatur: '/images/service-reparatur.jpg',
}

const gallery = (a, b, c) => [
  { url: a, alt: 'Gerät – Frontansicht' },
  { url: b, alt: 'Bedienoberfläche' },
  { url: c, alt: 'Handstück im Einsatz' },
]

const richBlocks = (name) => [
  { type: 'h2', content: 'Technologie & Einsatz' },
  {
    type: 'paragraph',
    content: `Der ${name} verbindet hohe Behandlungsleistung mit einfacher Bedienung. Ideal für Studios, die auf konstante Ergebnisse und kurze Behandlungszeiten setzen.`,
  },
  { type: 'h3', content: 'Ihre Vorteile' },
  {
    type: 'bulletList',
    content: [
      'Schnelle Behandlungen dank großer Spotgröße',
      'Integrierte Kontaktkühlung für hohen Komfort',
      'Intuitive Touch-Oberfläche mit Behandlungsprotokollen',
      'Wartungsarm und langlebig – auf den Studioalltag ausgelegt',
    ],
  },
  {
    type: 'paragraph',
    content:
      'Sie sind unsicher, ob das Gerät zu Ihrem Angebot passt? Wir beraten Sie kostenlos und unverbindlich – von der Auswahl bis zur Einweisung.',
  },
]

const specs = [
  {
    group: 'Leistung',
    items: [
      { label: 'Wellenlängen', value: '755 / 808 / 1064 nm' },
      { label: 'Spotgröße', value: '12 × 15 mm' },
      { label: 'Max. Frequenz', value: '10 Hz' },
    ],
  },
  {
    group: 'Technik',
    items: [
      { label: 'Kühlung', value: 'Kontaktkühlung bis −5 °C' },
      { label: 'Display', value: '10,4" Touchscreen' },
      { label: 'Gewicht', value: '38 kg' },
    ],
  },
]

const faq = [
  {
    question: 'Für welche Hauttypen ist das Gerät geeignet?',
    answer: 'Dank mehrerer Wellenlängen für alle Hauttypen I–VI geeignet.',
  },
  {
    question: 'Gibt es eine Einweisung?',
    answer: 'Ja, jede Lieferung beinhaltet eine persönliche Einweisung vor Ort.',
  },
  {
    question: 'Wie sieht es mit Wartung aus?',
    answer:
      'Wir übernehmen Wartung und Reparatur herstellerunabhängig – auf Wunsch mit Wartungsvertrag.',
  },
]

const downloads = [{ label: 'Datenblatt (PDF)', url: '/images/service-verkauf.jpg' }]

/** @type {Array<Partial<import('../src/types/product').Product> & {categorySlug:string}>} */
const PRODUCTS = [
  {
    slug: 'diodenlaser-pro-x3',
    name: 'Diodenlaser Pro X3',
    brand: 'KRET',
    categorySlug: 'diodenlaser',
    headline: 'Diodenlaser Pro X3 – dauerhafte Haarentfernung mit 3 Wellenlängen',
    cardSummary:
      'Leistungsstarker Diodenlaser mit 755, 808 und 1064 nm für alle Hauttypen – schnelle Behandlungen, hoher Komfort.',
    priceCents: 1290000,
    priceNote: 'zzgl. MwSt.',
    acquisition: ['kauf', 'leasing', 'miete'],
    hero: IMG.laser,
    full: true,
  },
  {
    slug: 'diodenlaser-lite-s',
    name: 'Diodenlaser Lite S',
    brand: 'KRET',
    categorySlug: 'diodenlaser',
    headline: 'Diodenlaser Lite S – der kompakte Einstieg in die Laser-Haarentfernung',
    cardSummary:
      'Kompakter 808-nm-Diodenlaser für Einsteiger – zuverlässig, platzsparend und sofort einsatzbereit.',
    priceCents: 790000,
    priceNote: 'zzgl. MwSt.',
    acquisition: ['kauf', 'miete'],
    hero: IMG.wartung,
  },
  {
    slug: 'shr-speed-2',
    name: 'SHR Speed 2.0',
    brand: 'Spark',
    categorySlug: 'shr',
    headline: 'SHR Speed 2.0 – nahezu schmerzfreie Haarentfernung im In-Motion-Verfahren',
    cardSummary:
      'SHR-Technologie für nahezu schmerzfreie Behandlungen bei hoher Geschwindigkeit – auch auf gebräunter Haut.',
    priceCents: 890000,
    priceNote: 'zzgl. MwSt.',
    acquisition: ['kauf', 'finanzierung'],
    hero: IMG.mobil,
  },
  {
    slug: 'ipl-vari-pulse',
    name: 'IPL Vari-Pulse',
    brand: 'ENECA',
    categorySlug: 'ipl',
    headline: 'IPL Vari-Pulse – vielseitige Lichtimpulstherapie für Haut & Haar',
    cardSummary:
      'Vielseitiges IPL-Gerät mit wechselbaren Filtern für Haarentfernung, Hautbild und Gefäße.',
    priceCents: null,
    priceNote: null,
    acquisition: ['kauf'],
    hero: IMG.beratung,
  },
  {
    slug: 'cryoshape-360',
    name: 'CryoShape 360',
    brand: 'KRET',
    categorySlug: 'kryolipolyse',
    headline: 'CryoShape 360 – gezielte Fettreduktion durch Kryolipolyse',
    cardSummary:
      'Kryolipolyse-System mit 360°-Applikatoren zur gezielten, nicht-invasiven Fettreduktion.',
    priceCents: 1590000,
    priceNote: 'zzgl. MwSt.',
    acquisition: ['kauf', 'leasing'],
    hero: IMG.miete,
  },
  {
    slug: 'aquaglow-deluxe',
    name: 'AquaGlow Deluxe',
    brand: 'KRET',
    categorySlug: 'aquafacial',
    headline: 'AquaGlow Deluxe – Tiefenreinigung und Hydratation in einem Schritt',
    cardSummary:
      'Aquafacial-Gerät für Tiefenreinigung, Peeling und Hydratation – sichtbar frische Haut ohne Ausfallzeit.',
    priceCents: 690000,
    priceNote: 'zzgl. MwSt.',
    acquisition: ['kauf', 'miete'],
    hero: IMG.reparatur,
  },
]

async function categoryMap() {
  const res = await db.execute('SELECT id, slug FROM categories')
  return new Map(res.rows.map((r) => [String(r.slug), Number(r.id)]))
}

async function clean() {
  for (const p of PRODUCTS) {
    await db.execute({ sql: 'DELETE FROM products WHERE slug = ?', args: [p.slug] })
  }
  console.log(`🧹 ${PRODUCTS.length} Demo-Produkte entfernt.`)
}

async function seed() {
  const cats = await categoryMap()
  const now = new Date().toISOString()
  let order = 1
  for (const p of PRODUCTS) {
    await db.execute({ sql: 'DELETE FROM products WHERE slug = ?', args: [p.slug] })
    const g = gallery(p.hero, IMG.wartung, IMG.beratung)
    await db.execute({
      sql: `INSERT INTO products (
              slug, name, brand, category_id, status, sort_order,
              headline, card_summary, price_cents, price_note, acquisition_json,
              hero_image, hero_image_alt, gallery_json, blocks_json, specs_json,
              faq_json, downloads_json, meta_title, meta_description, meta_keywords,
              created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        p.slug,
        p.name,
        p.brand,
        cats.get(p.categorySlug) ?? null,
        'published',
        order++,
        p.headline,
        p.cardSummary,
        p.priceCents,
        p.priceNote,
        JSON.stringify(p.acquisition),
        p.hero,
        `${p.name} – Produktansicht`,
        JSON.stringify(g),
        JSON.stringify(p.full ? richBlocks(p.name) : richBlocks(p.name).slice(0, 3)),
        JSON.stringify(specs),
        JSON.stringify(faq),
        JSON.stringify(downloads),
        `${p.name} kaufen | KRET-Manufaktur`,
        p.cardSummary,
        `${p.name}, Kosmetikgerät, ${p.categorySlug}`,
        now,
        now,
      ],
    })
  }
  console.log(`✅ ${PRODUCTS.length} Demo-Produkte angelegt (Status: published).`)
}

const mode = process.argv.includes('--clean') ? clean : seed
mode()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
