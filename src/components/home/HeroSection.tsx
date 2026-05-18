"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { ArrowDownIcon } from "@heroicons/react/24/outline";

const kretValues = [
  { letter: "K", word: "undenorientiert" },
  { letter: "R", word: "entabel" },
  { letter: "E", word: "ffizient" },
  { letter: "T", word: "ransparent" },
];

const textVariants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const imageVariants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" as const, delay: 0.2 },
  },
};

export default function HeroSection() {
  return (
    <section className="bg-white min-h-[90vh] flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pb-6 w-full">
        <motion.div variants={textVariants} initial="hidden" animate="visible">
          <div className="mb-8 space-y-0.5">
            {kretValues.map(({ letter, word }) => (
              <div key={letter} className="flex items-baseline">
                <span className="text-2xl lg:text-3xl font-black text-[#B8943F] leading-tight">{letter}</span>
                <span className="text-2xl lg:text-3xl font-light text-[#0F172A] leading-tight">{word}</span>
              </div>
            ))}
          </div>

          <div className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed space-y-3">
            <p>
              Wir sind Ihr professioneller Ansprechpartner, wenn Sie den Sprung in die apparative Kosmetik
              schaffen wollen. Wir finden den passenden Laser für Haarentfernung für Sie und bieten Ihnen
              darüber hinaus auch andere Technologien wie IPL, SHR oder mehr an.
            </p>
            <p>
              Schon seit 15 Jahren unterstützen wir Menschen dabei, sich den Traum der Selbstständigkeit in
              der Beauty-Branche zu erfüllen – und haben nicht nur das passende Kosmetikgerät für Sie, sondern
              bieten Ihnen auch einen qualitativ hochwertigen Service in Form von Kosmetikgerät-Wartungen und
              Reparaturen aller Art.
            </p>
            <p>
              Darüber hinaus erhalten Sie jederzeit eine gezielte Beratung auf dem gesamten Weg: Von der
              kostenlosen Erstberatung über den Geräte-Kauf bis zum After-Sales-Service ein Leben lang.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button href="#leistungen" variant="primary" size="lg">
              Unsere Leistungen
              <ArrowDownIcon className="w-5 h-5" />
            </Button>
            <Button href="mailto:info@kret-manufaktur.de" variant="outline" size="lg">
              Kostenlose Erstberatung
            </Button>
          </div>
        </motion.div>

        <motion.div
          variants={imageVariants}
          initial="hidden"
          animate="visible"
          className="relative h-[480px] lg:h-[580px] rounded-2xl overflow-hidden shadow-2xl"
        >
          <Image
            src="/images/nikita-hero.jpg"
            alt="Nikita, Experte für Kosmetikgeräte, umgeben von professionellen Laser- und Kosmetikgeräten"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0F172A]/20 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
