import { watch as fsWatch } from 'fs'
import { debounce } from './debounce.js'
import { spawn } from 'child_process'

export function watch (paths: string[], commands: string[], delay = 200, init = true) {
  async function run () {
    console.log('run', commands)
    for (const cmd of commands) {
      console.log('RUN:', cmd)
      const proc = spawn(cmd, { stdio: 'inherit' })
      await new Promise((resolve, reject) => {
        proc.addListener('exit', (code) => code ? reject(code) : resolve(true))
        proc.addListener('error', reject)
      })
    }
  }
  const lazyListener = debounce(delay, run)
  lazyListener()
  for (const path of paths) {
    fsWatch(path, () => lazyListener())
  }
}
