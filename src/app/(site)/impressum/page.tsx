import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Impressum der KRET-Manufaktur',
  robots: { index: false, follow: false },
}

export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-8 border-b border-slate-200 pb-5 font-serif text-4xl font-bold text-navy-900">
        Impressum
      </h1>

      <div className="prose prose-slate max-w-none space-y-6 leading-relaxed text-slate-700">
        <section>
          <h2 className="mb-3 text-xl font-bold tracking-tight text-navy-900">Angaben gemäß § 5 TMG</h2>
          <p>
            KRET-Manufaktur
            <br />
            [Inhaber: Vorname Nachname]
            <br />
            [Straße und Hausnummer]
            <br />
            [PLZ] [Stadt]
            <br />
            Deutschland
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold tracking-tight text-navy-900">Kontakt</h2>
          <p>
            Telefon: [TELEFON]
            <br />
            E-Mail: info@kret-manufaktur.de
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold tracking-tight text-navy-900">Umsatzsteuer-ID</h2>
          <p>
            Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:
            <br />
            [USt-IdNr.]
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold tracking-tight text-navy-900">
            Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
          </h2>
          <p>
            [Vorname Nachname]
            <br />
            [Straße und Hausnummer]
            <br />
            [PLZ] [Stadt]
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold tracking-tight text-navy-900">Haftung für Inhalte</h2>
          <p>
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen
            Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
            Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
            Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
            Tätigkeit hinweisen.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold tracking-tight text-navy-900">Haftung für Links</h2>
          <p>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
            Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr
            übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
            oder Betreiber der Seiten verantwortlich.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold tracking-tight text-navy-900">Urheberrecht</h2>
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
            unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung
            und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
            schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
          </p>
        </section>
      </div>
    </div>
  )
}
