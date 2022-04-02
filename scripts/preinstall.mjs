import { log } from './utils.mjs'

if (!/pnpm/.test(process.env.npm_execpath || '')) {
  log.red(
    `This repository requires using pnpm as the package manager ` +
      ` for scripts to work properly.\n`,
  )
  process.exit(1)
}
