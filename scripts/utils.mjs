import fs from 'fs/promises'
import { URL } from 'node:url'

export const url = (path, base = import.meta.url) => new URL(path, base)

export const { version } = JSON.parse(await fs.readFile(url('../package.json')))
export const newVersion = version
  .split('.')
  .map(n => parseInt(n))
  .join('.')

export function log(str) {
  console.log(str)
}

const colors = {
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  cyan: [36, 39],
  white: [37, 39],
  gray: [90, 39],
}

Object.keys(colors).forEach(color => {
  log[color] = str =>
    console.log(`\u001b[${colors[color][0]}m${str}\u001b[${colors[color][1]}m`)
})
