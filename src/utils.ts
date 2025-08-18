import { useLogger } from 'reactive-vscode'
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
