import { CheckCircleIcon } from '@heroicons/react/24/solid'
import Button from '@/components/ui/Button'
import type { ServiceSection } from '@/types/service'

/**
 * Gemeinsamer Renderer für die Textblöcke von Leistungen und Produkten.
 * Beide Datenquellen liefern dieselbe Struktur, damit lange Inhalte überall
 * identisch aussehen.
 */
export function renderSection(section: ServiceSection, idx: number, ctaHref: string) {
  switch (section.type) {
    case 'h2':
      return (
        <h2
          key={idx}
          className="mb-4 mt-10 font-serif text-2xl font-bold text-navy-900 first:mt-0 lg:text-3xl"
        >
          {section.content as string}
        </h2>
      )
    case 'h3':
      return (
        <h3 key={idx} className="mb-3 mt-8 text-xl font-bold tracking-tight text-navy-900">
          {section.content as string}
        </h3>
      )
    case 'paragraph':
      return (
        <p key={idx} className="mb-4 leading-relaxed text-slate-600">
          {section.content as string}
        </p>
      )
    case 'bulletList':
      return (
        <ul key={idx} className="mb-6 space-y-3">
          {(section.content as string[]).map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" />
              <span className="text-slate-600">{item}</span>
            </li>
          ))}
        </ul>
      )
    case 'cta':
      return (
        <div key={idx} className="mt-10 pt-8 border-t border-slate-200">
          <Button href={ctaHref} variant="primary" size="lg">
            {section.content as string}
          </Button>
        </div>
      )
    default:
      return null
  }
}

export default function ContentBlocks({
  blocks,
  ctaHref = 'mailto:info@kret-manufaktur.de',
}: {
  blocks: ServiceSection[]
  ctaHref?: string
}) {
  return <>{blocks.map((section, idx) => renderSection(section, idx, ctaHref))}</>
}
