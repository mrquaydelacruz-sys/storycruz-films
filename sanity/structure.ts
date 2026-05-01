import type { StructureResolver } from 'sanity/structure'

function listItemSchemaName(item: {
  getSchemaType?: () => string | { name?: string } | undefined
}): string | undefined {
  if (typeof item?.getSchemaType !== 'function') return undefined
  const t = item.getSchemaType()
  if (t == null) return undefined
  if (typeof t === 'string') return t
  if (typeof t === 'object' && 'name' in t && typeof (t as { name: unknown }).name === 'string') {
    return (t as { name: string }).name
  }
  return undefined
}

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('packageBuilderBrief').title('Client package links'),
      ...S.documentTypeListItems().filter(
        (item) => listItemSchemaName(item) !== 'packageBuilderBrief'
      ),
    ])
