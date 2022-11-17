import { watch as fsWatch } from 'fs'
import { debounce } from './debounce.js'
import { ChildProcess, spawn } from 'child_process'

export function watch (paths: string[], commands: string[], delay = 200, init = true) {
  console.log('watching:', paths)
  let proc:ChildProcess
  async function run () {
    for (const [cmd, ...args] of commands) {
      // console.log('[RUN] START:', cmd, args.join(' '))
      proc = spawn(cmd, args, { stdio: 'inherit' })
      try {
        await new Promise((resolve, reject) => {
          proc.addListener('exit', (code) => code ? reject(code) : resolve(true))
          proc.addListener('error', reject)
        })        
        // console.log('[RUN]   END:', cmd, args.join(' '))
      } catch (error) {
        // console.log('[RUN] ERROR:', cmd, args.join(' '), '=>', error)
        break
      }
    }
    // console.log('[RUN] CLOSED')
  }

  const lazyListener = debounce(delay, () => {
    if (proc) {
      // console.log('[WATCH] KILL PID', proc.pid)
      proc.kill('SIGINT')
    }
    run()
  })
  if (init) lazyListener()

  for (const path of paths) {
    fsWatch(path, { recursive: true }, () => lazyListener())
  }
}
