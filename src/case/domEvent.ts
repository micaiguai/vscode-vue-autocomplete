import type { TextDocument, TextDocumentContentChangeEvent } from 'vscode'
import { useActiveTextEditor } from 'reactive-vscode'
import { Position, Range, Selection } from 'vscode'
import { findUntil, ucfirst } from '../utils'

const activeTextEditor = useActiveTextEditor()

export const domEvent = {
  async handler(lineText: string, document: TextDocument, textDocumentContentChangeEvent: TextDocumentContentChangeEvent) {
    const regExp = /@(\w+)=""/
    if (!lineText.match(regExp))
      return
    const name = lineText.match(regExp)![1]
    const fullStr = `@${name}=""`
    const index = fullStr.lastIndexOf(textDocumentContentChangeEvent.text)
    const findResult = findUntil(
      document,
      textDocumentContentChangeEvent.range.start.translate({
        characterDelta: fullStr.length - index,
      }),
      /(@\w+)=""/,
    )
    if (!findResult)
      return
    await activeTextEditor.value?.edit((editBuilder) => {
      editBuilder.insert(new Position(findResult.position.line, findResult.position.character + fullStr.length - 1), `on${ucfirst(name)}`)
    })
    const endOfScriptTag = '</script>'
    const offset = document.getText().indexOf(endOfScriptTag)
    const position = document.positionAt(offset)
    await activeTextEditor.value?.edit((editBuilder) => {
      editBuilder.insert(new Position(position.line, 0), `
function on${ucfirst(name)}() {
  
}
`)
    })
    const newPosition = new Position(position.line + 2, 2)
    activeTextEditor.value!.selection = new Selection(newPosition, newPosition)
    activeTextEditor.value!.revealRange(new Range(newPosition, newPosition))
  },
}
