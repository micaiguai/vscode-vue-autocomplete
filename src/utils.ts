import type { Position, TextDocument } from 'vscode'
import { useLogger } from 'reactive-vscode'
import { Range } from 'vscode'
import { displayName } from './generated/meta'

export const logger = useLogger(displayName)
export function getTemplate(text: string) {
  const regexp = /<template>([\s\S]*)<\/template>/
  const [, template] = text.match(regexp) || []
  return template.trim()
}

export function getScript(text: string) {
  const regexp = /<script>([\s\S]*)<\/script>/
  const [, script] = text.match(regexp) || []
  return script.trim()
}

/**
 * uppercase the first letter
 */
export function ucfirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function isDelete(str: string) {
  return str === ''
}

export function getTag(document: TextDocument, position: Position) {
  return findUntil(document, position, /<([\w-]+)>/)?.result[1]
}

export function findUntil(document: TextDocument, position: Position, regExp: RegExp) {
  let fix = -1
  while (true) {
    const offset = document.offsetAt(position)
    const prevPosition = document.positionAt(offset + fix)
    if (prevPosition.line === 0 && prevPosition.character === 0)
      return
    const text = document.getText(new Range(prevPosition, position))
    const result = text.match(regExp) || []
    const [, target] = result
    if (target) {
      return {
        result,
        position: prevPosition,
      }
    }
    fix--
  }
}
