'use client'

import ListEditor from './ListEditor'
import { Select, TextArea, TextInput } from './AdminFields'
import type {
  ProductBlock,
  ProductFaqItem,
  ProductSpecGroup,
} from '@/types/product'

const BLOCK_TYPE_LABELS: Record<ProductBlock['type'], string> = {
  h2: 'Überschrift (gross)',
  h3: 'Überschrift (klein)',
  paragraph: 'Absatz',
  bulletList: 'Aufzählung',
  cta: 'Button',
}

/**
 * Der Editor für die langen Produkttexte. Er erzeugt genau die Struktur, die
 * auch die Leistungsseiten verwenden (ServiceSection), damit beides über
 * denselben Renderer läuft.
 */
export function BlockEditor({
  blocks,
  onChange,
}: {
  blocks: ProductBlock[]
  onChange: (blocks: ProductBlock[]) => void
}) {
  function changeType(index: number, type: ProductBlock['type']) {
    onChange(
      blocks.map((block, i) => {
        if (i !== index) return block
        // Aufzählung speichert ein Array, alle anderen Typen einen String –
        // beim Wechsel muss der Inhalt mit umgeformt werden.
        if (type === 'bulletList') {
          const content = Array.isArray(block.content)
            ? block.content
            : block.content
              ? [block.content]
              : ['']
          return { type, content }
        }
        const content = Array.isArray(block.content)
          ? block.content.join(' ')
          : block.content
        return { type, content }
      })
    )
  }

  return (
    <ListEditor
      items={blocks}
      onChange={onChange}
      createItem={(): ProductBlock => ({ type: 'paragraph', content: '' })}
      addLabel="Textblock hinzufügen"
      emptyHint="Noch kein Text. Fügen Sie Überschriften, Absätze und Aufzählungen hinzu – so entsteht die ausführliche Produktbeschreibung."
      itemLabel={(block) => BLOCK_TYPE_LABELS[block.type]}
      renderItem={(block, index, update) => (
        <div className="space-y-2">
          <Select
            value={block.type}
            onChange={(event) =>
              changeType(index, event.target.value as ProductBlock['type'])
            }
            aria-label="Art des Blocks"
          >
            {Object.entries(BLOCK_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>

          {block.type === 'bulletList' ? (
            <TextArea
              rows={5}
              value={(block.content as string[]).join('\n')}
              onChange={(event) =>
                update({
                  content: event.target.value.split('\n'),
                } as Partial<ProductBlock>)
              }
              placeholder={'Ein Listenpunkt pro Zeile\nz. B. 4 Wellenlängen\nz. B. Integrierte Kühlung'}
            />
          ) : block.type === 'paragraph' ? (
            <TextArea
              rows={5}
              value={block.content as string}
              onChange={(event) =>
                update({ content: event.target.value } as Partial<ProductBlock>)
              }
              placeholder="Fliesstext …"
            />
          ) : (
            <TextInput
              value={block.content as string}
              onChange={(event) =>
                update({ content: event.target.value } as Partial<ProductBlock>)
              }
              placeholder={
                block.type === 'cta' ? 'Button-Text, z. B. Jetzt anfragen' : 'Überschrift'
              }
            />
          )}
        </div>
      )}
    />
  )
}

export function SpecsEditor({
  specs,
  onChange,
}: {
  specs: ProductSpecGroup[]
  onChange: (specs: ProductSpecGroup[]) => void
}) {
  return (
    <ListEditor
      items={specs}
      onChange={onChange}
      createItem={() => ({ group: '', items: [{ label: '', value: '' }] })}
      addLabel="Gruppe hinzufügen"
      emptyHint="Keine technischen Daten. Gruppieren Sie die Werte z. B. nach „Laser“, „Kühlung“ und „Stromversorgung“."
      itemLabel={(group) => group.group || 'Neue Gruppe'}
      renderItem={(group, _index, update) => (
        <div className="space-y-3">
          <TextInput
            value={group.group}
            onChange={(event) => update({ group: event.target.value })}
            placeholder="Gruppenname, z. B. Laser"
          />

          <div className="space-y-2">
            {group.items.map((item, itemIndex) => (
              <div key={itemIndex} className="flex gap-2">
                <TextInput
                  value={item.label}
                  onChange={(event) =>
                    update({
                      items: group.items.map((entry, i) =>
                        i === itemIndex ? { ...entry, label: event.target.value } : entry
                      ),
                    })
                  }
                  placeholder="Bezeichnung"
                  className="flex-1"
                />
                <TextInput
                  value={item.value}
                  onChange={(event) =>
                    update({
                      items: group.items.map((entry, i) =>
                        i === itemIndex ? { ...entry, value: event.target.value } : entry
                      ),
                    })
                  }
                  placeholder="Wert"
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() =>
                    update({ items: group.items.filter((_, i) => i !== itemIndex) })
                  }
                  aria-label="Zeile entfernen"
                  className="px-2 text-slate-400 hover:text-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => update({ items: [...group.items, { label: '', value: '' }] })}
              className="text-sm font-medium text-[#B8943F] hover:text-[#9d7d34] transition-colors"
            >
              + Zeile
            </button>
          </div>
        </div>
      )}
    />
  )
}

export function FaqEditor({
  faq,
  onChange,
}: {
  faq: ProductFaqItem[]
  onChange: (faq: ProductFaqItem[]) => void
}) {
  return (
    <ListEditor
      items={faq}
      onChange={onChange}
      createItem={() => ({ question: '', answer: '' })}
      addLabel="Frage hinzufügen"
      emptyHint="Keine Fragen hinterlegt. FAQ-Einträge erscheinen auf der Produktseite und werden von Google als strukturierte Daten ausgelesen."
      itemLabel={(item) => item.question || 'Neue Frage'}
      renderItem={(item, _index, update) => (
        <div className="space-y-2">
          <TextInput
            value={item.question}
            onChange={(event) => update({ question: event.target.value })}
            placeholder="Frage"
          />
          <TextArea
            rows={3}
            value={item.answer}
            onChange={(event) => update({ answer: event.target.value })}
            placeholder="Antwort"
          />
        </div>
      )}
    />
  )
}
