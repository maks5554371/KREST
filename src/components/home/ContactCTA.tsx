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
          <p className="text-sm font-semibold tracking-widest text-[#B8943F] uppercase mb-3">Kontakt</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-4">
            Bereit für den nächsten Schritt?
          </h2>
          <p className="text-slate-600 text-lg mb-10 max-w-2xl mx-auto">
            Egal ob Wartung, Reparatur oder Beratung – sprechen Sie uns an. Wir melden uns schnellstmöglich
            bei Ihnen. Die Erstberatung ist kostenlos und unverbindlich.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Button href="mailto:info@kret-manufaktur.de" variant="primary" size="lg">
              <EnvelopeIcon className="w-5 h-5" />
              E-Mail schreiben
            </Button>
            <Button href="https://wa.me/4915563338348" variant="whatsapp_outline" size="lg">
              <img src="/icons/whatsapp.svg" alt="" className="w-5 h-5" />
              WhatsApp schreiben
            </Button>
            <Button href="tel:[TELEFON]" variant="secondary" size="lg">
              <PhoneIcon className="w-5 h-5" />
              Anrufen
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-slate-50 rounded-xl">
              <p className="text-3xl font-black text-[#B8943F] mb-1">15+</p>
              <p className="text-slate-600 text-sm">Jahre Erfahrung</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-xl">
              <p className="text-3xl font-black text-[#B8943F] mb-1">100%</p>
              <p className="text-slate-600 text-sm">Herstellerunabhängig</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-xl">
              <p className="text-3xl font-black text-[#B8943F] mb-1">Kostenlos</p>
              <p className="text-slate-600 text-sm">Erstberatung</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
