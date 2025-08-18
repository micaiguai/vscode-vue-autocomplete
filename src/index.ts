import { baseParse } from '@vue/compiler-core'
import { defineExtension, useActiveTextEditor, useWorkspaceFolders, watchEffect } from 'reactive-vscode'
import { commands, CompletionItem, CompletionItemKind, languages, Position, Range, Selection, SnippetString, window, workspace } from 'vscode'
import { disposable } from './autocomplete'
import { getTemplate, logger, ucfirst } from './utils'

const { activate, deactivate } = defineExtension((context) => {
  logger.info('Activated')

  // const activeTextEditor = useActiveTextEditor()
  // const disposable = languages.registerCompletionItemProvider(
  //   { pattern: '**/*.{ts,tsx,js,jsx,vue,html}' },
  //   {
  //     provideCompletionItems(document, position) {
  //       // Regexp [const nameStr ]
  //       const regexp = /const\s+\w+\s$/
  //       // const text = document.getText()
  //       // const template = getTemplate(text)
  //       // logger.info('template', template)

  //       // return []
  //       // 获取当前光标所在位置的文本
  //       const text = document.getText(new Range(position.line, 0, position.line, position.character))
  //       logger.info('text', text)
  //       // const tag = getVDom = getVDom(text)
  //       // 获取当前标签的完整信息
  //       // try {
  //       //   const result = baseParse(text)
  //       //   logger.info('result :', result)
  //       // }
  //       // catch (error) {
  //       //   logger.info('error :', error)
  //       // }
  //       if (!regexp.test(text)) {
  //         return
  //       }
  //       // 创建一个补全项
  //       const completionItem = new CompletionItem('Vue.Ref', CompletionItemKind.Snippet)
  //       // eslint-disable-next-line no-template-curly-in-string
  //       completionItem.insertText = new SnippetString('= ref<${1}>()')
  //       return [completionItem]
  //     },
  //   },
  //   ' ',
  //   '=',
  // )

  // const disposable1 = languages.registerCodeActionsProvider(
  //   { pattern: '**/*.{ts,tsx,js,jsx,vue,html}' },
  //   {
  //     provideCodeActions(document, range, context, token) {
  //       return [
  //         {
  //           title: 'title test',
  //           command: 'command test',
  //           tooltip: 'tooltip test',
  //         },
  //       ]
  //     },
  //   },
  // )

  context.subscriptions.push(disposable)
})

export { activate, deactivate }
