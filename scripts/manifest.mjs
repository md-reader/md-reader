import fs from 'fs/promises'
import { url, log, newVersion } from './utils.mjs'

const manifestPath = url('../src/manifest.json')

try {
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'))
  log.blue(
    `📃[update manifest version]: ${manifest.version} ==> ${(manifest.version =
      newVersion)}`,
  )
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8')
} catch (err) {
  log.red(err)
  process.exit(1)
}
