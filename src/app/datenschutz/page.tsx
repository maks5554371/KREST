import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  description: 'Datenschutzerklärung der KRET-Manufaktur gemäß DSGVO',
  robots: { index: false, follow: false },
}

export default function DatenschutzPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-[#0F172A] mb-8">Datenschutzerklärung</h1>

      <div className="space-y-8 text-slate-700">
        <section>
          <h2 className="text-xl font-bold text-[#0F172A] mb-3">1. Datenschutz auf einen Blick</h2>
          <h3 className="font-semibold mb-2">Allgemeine Hinweise</h3>
          <p className="leading-relaxed">
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
            personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene
            Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0F172A] mb-3">
            2. Verantwortliche Stelle
          </h2>
          <p className="leading-relaxed">
            Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
            <br />
            <br />
            KRET-Manufaktur
            <br />
            [Inhaber: Vorname Nachname]
            <br />
            [Straße und Hausnummer]
            <br />
            [PLZ] [Stadt]
            <br />
            E-Mail: info@kret-manufaktur.de
            <br />
            Telefon: [TELEFON]
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0F172A] mb-3">3. Datenerfassung auf dieser Website</h2>
          <h3 className="font-semibold mb-2">Kontaktaufnahme per E-Mail</h3>
          <p className="leading-relaxed mb-4">
            Wenn Sie uns per E-Mail kontaktieren, werden Ihre angegebenen Daten (E-Mail-Adresse,
            Name, Nachricht) zum Zweck der Bearbeitung der Anfrage und für den Fall von
            Anschlussfragen gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung
            weiter.
          </p>
          <h3 className="font-semibold mb-2">Server-Log-Dateien</h3>
          <p className="leading-relaxed">
            Der Provider der Seiten erhebt und speichert automatisch Informationen in so
            genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies
            sind: Browsertyp und Browserversion, verwendetes Betriebssystem, Referrer URL,
            Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage und IP-Adresse.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0F172A] mb-3">4. Ihre Rechte</h2>
          <p className="leading-relaxed">
            Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und
            Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein
            Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine
            Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung
            jederzeit für die Zukunft widerrufen.
          </p>
          <p className="mt-3 leading-relaxed">
            Zur Geltendmachung Ihrer Rechte wenden Sie sich bitte an: info@kret-manufaktur.de
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0F172A] mb-3">
            5. Beschwerderecht bei der Aufsichtsbehörde
          </h2>
          <p className="leading-relaxed">
            Sie haben das Recht, sich bei der zuständigen Datenschutzaufsichtsbehörde über die
            Verarbeitung Ihrer personenbezogenen Daten zu beschweren.
          </p>
        </section>
      </div>
    </div>
  )
}
