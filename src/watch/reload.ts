import { watch as fsWatch } from 'fs'
import { debounce } from './debounce.js'
import { ChildProcess, spawn } from 'child_process'

export function watch (paths: string[], commands: string[], delay = 200, init = true) {
  console.log('watching:', paths)
  let proc:ChildProcess
  // let controller = new AbortController()
  async function run () {
    // console.log('run', commands)
    for (const [cmd, ...args] of commands) {
      console.log('[RUN] START:', cmd, args.join(' '))
      proc = spawn(cmd, args, {
        stdio: 'inherit',
        // signal: controller.signal
      })
      await new Promise((resolve, reject) => {
        proc.addListener('exit', (code) => code ? reject(code) : resolve(true))
        proc.addListener('error', reject)
      }).then(() => {
        console.log('[RUN]   END:', cmd, args.join(' '))
      }).catch(error => {
        console.log('[RUN] ERROR:', cmd, args.join(' '))
        console.error(error)
        process.exit(1)
      })
    }
    console.log('[RUN] DONE')
  }
  // const lazyListener = debounce(delay, run)
  function lazyListener () {
    if (proc) {
      console.log('killing PID', proc.pid)
      proc.kill('SIGINT')
    }
    run()
  }
  if (init) lazyListener()

  for (const path of paths) {
    fsWatch(path, { recursive: true }, () => lazyListener())
  }
}
