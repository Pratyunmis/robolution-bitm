import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'

type LexicalContent = Parameters<typeof convertLexicalToHTML>[0]['data']

export async function renderLexical(
  content: LexicalContent,
): Promise<string> {
  if (!content) return ''
  return convertLexicalToHTML({ data: content })
}
