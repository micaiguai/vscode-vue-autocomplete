import { useActiveTextEditor } from 'reactive-vscode'
import { Position, Selection, window, workspace } from 'vscode'
import { logger, ucfirst } from './utils'

const activeTextEditor = useActiveTextEditor()

const disposable = workspace.onDidChangeTextDocument((event) => {
  try {
    // 获取发生变化的文档
    const document = event.document

    // 只处理文本编辑器中的文档
    if (document.uri.scheme === 'file') {
      logger.info(`文档 ${document.uri.fsPath} 内容发生变化`)

      // 输出变更详情
      event.contentChanges.forEach((e) => {
        const line = e.range.start.line
        const column = e.range.start.character
        logger.info(`第${line}行第${column}列: ${e.text}`)
        const lineContent = document.lineAt(e.range.start.line).text
        if (lineContent.match(/^const ([^pros])+ $/)) {
          activeTextEditor.value?.edit((editBuilder) => {
            // insert [= ref<>()]
            editBuilder.insert(new Position(e.range.start.line, e.range.start.character + 1), '= ref<>()')
          })
            .then(() => {
              const newPosition = new Position(e.range.start.line, e.range.start.character + 7)
              activeTextEditor.value!.selection = new Selection(newPosition, newPosition)
              // 提示框
              window.showInformationMessage('插入成功')
            })
        }
        if (lineContent.match(/^const props $/)) {
          activeTextEditor.value?.edit((editBuilder) => {
            // insert [= ref<>()]
            editBuilder.insert(new Position(e.range.start.line, e.range.start.character + 1), `= defineProps<{
    
  }>()`)
          })
            .then(() => {
              const newPosition = new Position(e.range.start.line + 1, e.range.start.character + 2)
              activeTextEditor.value!.selection = new Selection(newPosition, newPosition)
              // 提示框
              window.showInformationMessage('插入成功')
            })
        }
        const regExp = /@(\w+)=""/
        if (lineContent.match(regExp)) {
          const name = lineContent.match(regExp)![1]
          const index = lineContent.indexOf(name)
          logger.info(`index: ${index}`)
          const isValid = index !== column - name.length - 1
          logger.info(`isValid: ${isValid}`)
          if (isValid) {
            return
          }
          activeTextEditor.value?.edit((editBuilder) => {
            editBuilder.insert(new Position(e.range.start.line, e.range.start.character + 1), `on${ucfirst(name)}`)
          })
            .then(() => {
              // 提示框
              window.showInformationMessage('插入成功')
              activeTextEditor.value?.edit((editBuilder) => {
                // insert [= ref<>()]
                editBuilder.insert(new Position(e.range.start.line - 3, 0), `function on${ucfirst(name)}() {
  
}
`)
              })
                .then(() => {
                  const newPosition = new Position(e.range.start.line - 2, 2)
                  activeTextEditor.value!.selection = new Selection(newPosition, newPosition)
                })
            })
        }
      })
    }
  }
  catch (error) {
    logger.error(error)
  }
})

export {
  disposable,
}
