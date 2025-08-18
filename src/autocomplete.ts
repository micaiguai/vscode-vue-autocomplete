import { workspace } from 'vscode'
import { domEvent } from './case/domEvent'
import { templateRef } from './case/templateRef'
import { isDelete, logger } from './utils'

const cases = [
  domEvent,
  templateRef,
]

const disposable = workspace.onDidChangeTextDocument(async (event) => {
  try {
    const document = event.document
    if (document.uri.scheme !== 'file')
      return
    event.contentChanges.forEach(async (e) => {
      if (isDelete(e.text))
        return
      const lineText = document.lineAt(e.range.start.line).text
      cases.forEach(async (item) => {
        item.handler(
          lineText,
          document,
          e,
        )
      })
    })
  }
  catch (error) {
    logger.error(error)
  }
})

export {
  disposable,
}
