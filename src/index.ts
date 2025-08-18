import { defineExtension } from 'reactive-vscode'
import { disposable } from './autocomplete'
import { logger } from './utils'

const { activate, deactivate } = defineExtension((context) => {
  logger.info('Activated')
  context.subscriptions.push(disposable)
})

export { activate, deactivate }
