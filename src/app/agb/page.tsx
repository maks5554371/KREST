import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AGB',
  description: 'Allgemeine Geschäftsbedingungen der KRET-Manufaktur',
  robots: { index: false, follow: false },
}

export default function AgbPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-[#0F172A] mb-8">
        Allgemeine Geschäftsbedingungen (AGB)
      </h1>

      <div className="space-y-8 text-slate-700">
        <section>
          <h2 className="text-xl font-bold text-[#0F172A] mb-3">§ 1 Geltungsbereich</h2>
          <p className="leading-relaxed">
            Diese Allgemeinen Geschäftsbedingungen gelten für alle Leistungen der KRET-Manufaktur
            ([Inhaber: Vorname Nachname], [Adresse]) gegenüber Unternehmern und Verbrauchern im
            Sinne des Bürgerlichen Gesetzbuches. Abweichende Bedingungen des Auftraggebers werden
            nicht anerkannt, es sei denn, KRET-Manufaktur stimmt ihrer Geltung ausdrücklich
            schriftlich zu.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0F172A] mb-3">§ 2 Leistungsumfang</h2>
          <p className="leading-relaxed">
            KRET-Manufaktur erbringt Dienstleistungen im Bereich Wartung, Reparatur, Verkauf,
            Leasing, Miete und Beratung von Kosmetikgeräten. Der genaue Leistungsumfang wird im
            jeweiligen Auftrag oder Angebot festgelegt. Änderungen oder Erweiterungen des
            Leistungsumfangs bedürfen der schriftlichen Vereinbarung.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0F172A] mb-3">§ 3 Diagnose und Kostenvoranschlag</h2>
          <p className="leading-relaxed">
            Vor Durchführung einer Reparatur erstellt KRET-Manufaktur auf Wunsch des Auftraggebers
            einen unverbindlichen Kostenvoranschlag. Reparaturarbeiten werden erst nach ausdrücklicher
            Zustimmung des Auftraggebers zur Kostenhöhe begonnen. Diagnoseleistungen können gesondert
            berechnet werden.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0F172A] mb-3">§ 4 Preise und Zahlung</h2>
          <p className="leading-relaxed">
            Alle Preise verstehen sich zuzüglich der gesetzlichen Umsatzsteuer. Die Zahlung ist
            nach Abschluss der Leistung und Rechnungsstellung fällig, sofern nichts anderes
            vereinbart wurde. Bei Zahlungsverzug werden Verzugszinsen gemäß § 288 BGB berechnet.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0F172A] mb-3">§ 5 Gewährleistung</h2>
          <p className="leading-relaxed">
            KRET-Manufaktur gewährt auf Reparaturleistungen eine Gewährleistung von 3 Monaten ab
            Abnahme. Die Gewährleistung bezieht sich ausschließlich auf die durchgeführte Reparatur
            und die verwendeten Ersatzteile. Nicht umfasst sind Schäden durch unsachgemäße
            Handhabung oder externe Einflüsse.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0F172A] mb-3">§ 6 Haftungsbeschränkung</h2>
          <p className="leading-relaxed">
            KRET-Manufaktur haftet für Schäden nur bei Vorsatz oder grober Fahrlässigkeit. Die
            Haftung für mittelbare Schäden, insbesondere entgangenen Gewinn, wird ausgeschlossen,
            soweit dies gesetzlich zulässig ist. Die Haftung ist der Höhe nach auf den
            Auftragswert begrenzt.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0F172A] mb-3">§ 7 Gerichtsstand und anwendbares Recht</h2>
          <p className="leading-relaxed">
            Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
            Gerichtsstand ist, soweit gesetzlich zulässig, der Sitz von KRET-Manufaktur.
          </p>
        </section>

        <p className="text-sm text-slate-500 mt-10">
          Stand: {new Date().getFullYear()} – Bitte wenden Sie sich an info@kret-manufaktur.de für individuelle
          vertragliche Vereinbarungen.
        </p>
      </div>
    </div>
  )
}
