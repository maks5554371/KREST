import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  description: 'Datenschutzerklärung der KRET-Manufaktur gemäß DSGVO',
  robots: { index: false, follow: false },
}

export default function DatenschutzPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-8 border-b border-slate-200 pb-5 font-serif text-4xl font-bold text-navy-900">
        Datenschutzerklärung
      </h1>

      <div className="space-y-8 leading-relaxed text-slate-700">
        <section>
          <h2 className="mb-3 text-xl font-bold tracking-tight text-navy-900">1. Datenschutz auf einen Blick</h2>
          <h3 className="font-semibold mb-2">Allgemeine Hinweise</h3>
          <p className="leading-relaxed">
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
            personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene
            Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold tracking-tight text-navy-900">
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
          <h2 className="mb-3 text-xl font-bold tracking-tight text-navy-900">3. Datenerfassung auf dieser Website</h2>
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
          <h2 className="mb-3 text-xl font-bold tracking-tight text-navy-900">
            4. Cookies und Einwilligung
          </h2>
          <p className="leading-relaxed mb-4">
            Technisch notwendige Cookies setzen wir auf Grundlage von § 25 Abs. 2 Nr. 2 TDDDG
            (vormals TTDSG) sowie Art. 6 Abs. 1 lit. f DSGVO ohne Einwilligung ein. Alle
            übrigen Kategorien – funktionale, statistische und Marketing-Zwecke – werden erst
            nach Ihrer ausdrücklichen Einwilligung im Cookie-Banner aktiviert (§ 25 Abs. 1
            TDDDG, Art. 6 Abs. 1 lit. a DSGVO). Derzeit ist in diesen Kategorien kein Dienst
            aktiv; Analyse- oder Tracking-Dienste Dritter binden wir nicht ein.
          </p>
          <h3 className="font-semibold mb-2">Kategorien</h3>
          <ul className="leading-relaxed list-disc pl-5 space-y-2 mb-4">
            <li>
              <strong>Notwendig</strong> – Betrieb der Website, Speicherung Ihrer
              Cookie-Auswahl, Anmeldung im Verwaltungsbereich. Immer aktiv.
            </li>
            <li>
              <strong>Funktional</strong> – eingebettete Inhalte Dritter (z. B. Karten,
              Videos, Messenger-Kontakt). Nur mit Einwilligung.
            </li>
            <li>
              <strong>Statistik</strong> – zusammengefasste Auswertung der Seitennutzung. Nur
              mit Einwilligung.
            </li>
            <li>
              <strong>Marketing</strong> – Ausspielung passender Angebote und Messung von
              Kampagnen. Nur mit Einwilligung.
            </li>
          </ul>
          <h3 className="font-semibold mb-2">Eingesetzte Cookies und lokale Speicherung</h3>
          <ul className="leading-relaxed list-disc pl-5 space-y-2 mb-4">
            <li>
              <strong>kret_admin</strong> – Session-Cookie des geschützten
              Verwaltungsbereichs. Es wird ausschliesslich nach einer Anmeldung durch den
              Websitebetreiber gesetzt, ist <em>HttpOnly</em> und läuft nach 7 Tagen ab.
              Besucherinnen und Besucher der Website erhalten dieses Cookie nicht.
            </li>
            <li>
              <strong>kret-cookie-consent</strong> – Eintrag im lokalen Speicher
              (localStorage) Ihres Browsers mit Ihrer Auswahl und dem Zeitpunkt der
              Einwilligung. Es handelt sich nicht um ein Cookie; es werden keine Daten an uns
              übertragen.
            </li>
          </ul>
          <h3 className="font-semibold mb-2">Widerruf Ihrer Einwilligung</h3>
          <p className="leading-relaxed">
            Sie können Ihre Auswahl jederzeit mit Wirkung für die Zukunft ändern oder
            widerrufen – über den Link „Cookie-Einstellungen“ im Fussbereich jeder Seite.
            Zusätzlich können Sie Cookies über die Einstellungen Ihres Browsers löschen oder
            deren Speicherung einschränken. Die Funktionsfähigkeit dieser Website bleibt davon
            unberührt.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold tracking-tight text-navy-900">5. Ihre Rechte</h2>
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
          <h2 className="mb-3 text-xl font-bold tracking-tight text-navy-900">
            6. Beschwerderecht bei der Aufsichtsbehörde
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
