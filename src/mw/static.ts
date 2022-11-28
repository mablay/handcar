import { createReadStream, watch } from 'fs'
import { access, readFile } from 'fs/promises'
import { IncomingMessage, ServerResponse } from 'http'
import { WebSocket } from 'ws'
import { join } from 'path'
import { Handcar } from '../types.js'
import { handcarLive } from '../watch/client-ws.js'
// import { fileURLToPath } from 'url'
// const __dirname = dirname(fileURLToPath(import.meta.url))

export function staticMiddleware (webroot: string, app: Handcar) {

  const clients = new Set<WebSocket>()
  app.ws('/ws', function staticWatcher (ws, req) {
    console.log('[handcar.ws.connect] url:', req.url)
    clients.add(ws)
  })

  watch(webroot, { recursive: true }, (ev, filename) => {
    console.log('[handcar.static.watch] CHANGE', filename, ev)
    for (const ws of clients) {
      ws.send('reload')
    }
  })

  /**
   * This middleware completes requests like:  
   * http://hostname/ => http://hostname/index.html  
   * It appends 'index.html' if 
   * 1. the url points to a location that is staticly hosted
   * 2. the url ends with a '/'
   * 3. an 'index.html' file is present at the targeted directory
   */
  return async function staticHandler (req: IncomingMessage, res: ServerResponse, next) {
    if (!webroot) return next()
    const url = new URL(req.url || '', `http://${req.headers.host}`)
    if (url.pathname === '/_handcar_ws.js') {
      // console.log('url:', url)
      // console.log('fn:', liveSocket.toString())
      return liveSocket(req, res)
    }
    const file = await resolveFile(webroot, url)
    // TODO: distinguish between ACCESS and EXISTS
    //       those should yield different error messages to the user
    if (!file) return next()
    console.log('[handcar.mw.autoIndexHandler]', req.url, '=>', file)
    if (file.endsWith('.html')) {
      return injectLiveWebsocket(file, res)
    }
    const stream = createReadStream(file)
    stream.pipe(res)
    stream.on('error', error => {
      res.statusCode = 500
      console.error(error)
      res.end()
    })
    stream.on('finish', () => res.end())
  }
}

function resolveFile (webroot: string, url: URL): Promise<string> {
  let file = join(process.cwd(), webroot, url.pathname)
  if (url.pathname.endsWith('/')) {
    file = join(file, 'index.html')
  }
  return access(file)
    .then(() => file)
    .catch(() => '')
}

/** Inject code into HTML files that loads the WS script */
async function injectLiveWebsocket (path: string, res: ServerResponse) {
  console.log('[handcar.mw.injectLiveWebsocket]', path)
  const html = await readFile(path, 'utf8')
  const i = html.indexOf('</body>')
  // console.log('inject WS code before:', i)
  const script = '<script src="/_handcar_ws.js"></script>'
  res.end([
    html.substring(0, i),
    '  ', script, '\n',
    html.substring(i)
  ].join(''))
}

/** Use this function to serve a function as text */
function liveSocket (_req: IncomingMessage, res: ServerResponse) {
  const wsUrl = 'ws://localhost:8080/ws'
  const script = [
    `handcarLive('${wsUrl}')`,
    handcarLive.toString()
  ].join('\n')
  res.end(script)
}
