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
    <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-white">
      {/* Dezente Tiefe: warme Gold- und kühle Navy-Lichthöfe auf Weiß. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-gold-500/[0.07] blur-3xl" />
        <div className="absolute -bottom-24 left-0 h-80 w-80 rounded-full bg-navy-900/[0.04] blur-3xl" />
      </div>

      <div className="relative z-10 grid w-full grid-cols-1 items-center gap-12 px-4 pb-6 sm:px-6 lg:grid-cols-2 lg:px-8 max-w-7xl mx-auto">
        <motion.div variants={textVariants} initial="hidden" animate="visible">
          <div className="mb-8 flex gap-4">
            <span aria-hidden className="mt-1.5 w-1 rounded-full bg-linear-to-b from-gold-400 to-gold-600" />
            <div className="space-y-0.5">
              {kretValues.map(({ letter, word }) => (
                <div key={letter} className="flex items-baseline">
                  <span className="text-3xl font-black leading-tight text-gold-500 lg:text-4xl">
                    {letter}
                  </span>
                  <span className="text-3xl font-light leading-tight tracking-tight text-navy-900 lg:text-4xl">
                    {word}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8 max-w-lg space-y-3 text-lg leading-relaxed text-slate-600">
            <p>
              Wir sind Ihr Partner für apparative Kosmetik – wir finden den passenden Laser oder
              IPL/SHR-Technologie für Sie.
            </p>
            <p>
              Seit 15 Jahren begleiten wir Menschen in die Selbstständigkeit der Beauty-Branche – mit
              passenden Geräten sowie Wartung und Reparatur.
            </p>
            <p>
              Dabei beraten wir Sie durchgehend: von der kostenlosen Erstberatung bis zum lebenslangen
              After-Sales-Service.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button href="#leistungen" variant="primary" size="lg">
              Unsere Leistungen
              <ArrowDownIcon className="h-5 w-5" />
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
          className="relative h-[480px] overflow-hidden rounded-card shadow-elevated ring-1 ring-navy-900/5 lg:h-[580px]"
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
          <div className="absolute inset-0 bg-linear-to-t from-navy-950/25 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
