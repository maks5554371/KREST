"use client";

import { motion } from "framer-motion";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";

export default function ContactCTA() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">Kontakt</p>
          <h2 className="mb-4 text-balance font-serif text-4xl font-bold text-navy-900 lg:text-5xl">
            Bereit für den nächsten Schritt?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-600">
            Egal ob Wartung, Reparatur oder Beratung – sprechen Sie uns an. Wir melden uns schnellstmöglich
            bei Ihnen. Die Erstberatung ist kostenlos und unverbindlich.
          </p>

          <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
            <Button href="mailto:info@kret-manufaktur.de" variant="primary" size="lg">
              <EnvelopeIcon className="h-5 w-5" />
              E-Mail schreiben
            </Button>
            <Button href="https://wa.me/4915563338348" variant="whatsapp_outline" size="lg">
              <img src="/icons/whatsapp.svg" alt="" className="h-5 w-5" />
              WhatsApp schreiben
            </Button>
            <Button href="tel:[TELEFON]" variant="secondary" size="lg">
              <PhoneIcon className="h-5 w-5" />
              Anrufen
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 text-center sm:grid-cols-3">
            {[
              { value: "15+", label: "Jahre Erfahrung" },
              { value: "100%", label: "Herstellerunabhängig" },
              { value: "Kostenlos", label: "Erstberatung" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-card border border-slate-200 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-card-hover"
              >
                <p className="mb-1 text-3xl font-black tracking-tight text-gold-500">{stat.value}</p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
