const euroFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

/** Preis in Cent → „12.900 €“, oder „Preis auf Anfrage“ wenn kein Preis gepflegt ist. */
export function formatPrice(priceCents: number | null): string {
  if (priceCents === null) return 'Preis auf Anfrage'
  return euroFormatter.format(priceCents / 100)
}

/** Cent → Euro-Wert für Formularfelder (z. B. 1290000 → "12900"). */
export function centsToEuroInput(priceCents: number | null): string {
  if (priceCents === null) return ''
  return String(priceCents / 100)
}
