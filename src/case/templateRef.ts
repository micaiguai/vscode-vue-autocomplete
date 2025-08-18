import type { TextDocument, TextDocumentContentChangeEvent } from 'vscode'
import { useActiveTextEditor } from 'reactive-vscode'
import { Position } from 'vscode'
import { findUntil, ucfirst } from '../utils'

const activeTextEditor = useActiveTextEditor()

export const templateRef = {
  async handler(lineText: string, document: TextDocument, textDocumentContentChangeEvent: TextDocumentContentChangeEvent) {
    const regExp = /ref=""/
    if (!lineText.match(regExp))
      return
    const tagFindResult = findUntil(
      document,
      textDocumentContentChangeEvent.range.start,
      /^<([\w-]+)/,
    )
    if (!tagFindResult)
      return
    const fullStr = 'ref=""'
    const index = fullStr.indexOf(textDocumentContentChangeEvent.text)
    const findResult = findUntil(
      document,
      textDocumentContentChangeEvent.range.start.translate({
        characterDelta: fullStr.length - index,
      }),
      /(ref="")/,
    )
    if (!findResult)
      return
    let variableName
    if (tagFindResult.result[1] === 'img') {
      variableName = 'image'
    }
    variableName = `${tagFindResult.result[1]}Ref`
    const domType = `HTML${ucfirst(tagFindResult.result[1])}Element`
    await activeTextEditor.value?.edit((editBuilder) => {
      editBuilder.insert(new Position(findResult.position.line, findResult.position.character + 'ref="'.length), variableName)
    })

    const endOfScriptTag = '</script>'
    const offset = document.getText().indexOf(endOfScriptTag)
    const position = document.positionAt(offset)
    await activeTextEditor.value?.edit((editBuilder) => {
      editBuilder.insert(new Position(position.line, 0), `
const ${variableName} = useTemplateRef<${domType}>(\'${variableName}\')      
`)
    })
  },
}
