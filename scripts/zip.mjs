import fs from 'fs/promises'
import { URL } from 'node:url'
import archiver from 'archiver'

const url = path => new URL(path, import.meta.url).pathname

const { version } = JSON.parse(await fs.readFile(url('../package.json')))
const entryDir = url('../extension')
const outputDir = url('../dist/')
const extName = `md-reader-${version}.zip`

try {
  await fs.access(entryDir)
  await fs.access(outputDir).catch(() => fs.mkdir(outputDir))

  const fh = await fs.open(outputDir + extName, 'w+')
  const output = fh.createWriteStream()

  const archive = archiver('zip', {
    zlib: { level: 9 },
  })

  archive.on('error', console.error)
  output.on('close', () =>
    console.log(
      `[Zip output]: ${outputDir + extName} [${archive.pointer()} bytes]`,
    ),
  )

  archive.pipe(output)
  archive.directory(entryDir, false)
  archive.finalize()
} catch (error) {
  console.error(error)
}
