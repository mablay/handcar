// A super lightweight web server
import { createServer as createHttpServer, IncomingMessage, Server, ServerResponse } from 'http'
import { createServer as createHttpsServer } from 'https'
import { template404 } from './templates/templates.js'
// import { readFileSync } from 'fs'
import { access, readFile } from 'fs/promises'
import { dirname, join } from 'path'
import { createReadStream } from 'fs'
// import { fileURLToPath } from 'url'
// const __dirname = dirname(fileURLToPath(import.meta.url))

const defaultOptions = {
  host: '127.0.0.1',
  port: 8080,
  https: false,
  // webroot: '.',
  watch: true
}

type Callback = (error?: Error|string) => void
type Handler = (req: IncomingMessage, res: ServerResponse, next: Callback) => void
type Middleware = ((path: string, handler: Handler) => void) | ((handler: Handler) => void)
type MidllewareStack = { path: string, handler: Handler }[]

type Handcar = Server & {
  use: (path:string, handler:Function) => void
}

export function createServer (options:any = {}, requestListener:Handler):Handcar {
  const { host, port, https, webroot } = Object.assign({}, defaultOptions, options)

  const middleware: MidllewareStack = [
    { path: '/', handler: notFoundHandler },
    { path: '/', handler: autoIndexHandler }
  ]

  function notFoundHandler (_req, res) {
    console.log('[handcar.mw.notFoundHandler]', _req.url)
    res.statusCode = 404
    res.end(template404)
  }

  /**
   * This middleware completes requests like:  
   * http://hostname/ => http://hostname/index.html  
   * It appends 'index.html' if 
   * 1. the url points to a location that is staticly hosted
   * 2. the url ends with a '/'
   * 3. an 'index.html' file is present at the targeted directory
   */
   async function autoIndexHandler (req: IncomingMessage, res: ServerResponse, next) {
    if (!webroot) return next()
    const url = new URL(req.url || '', `http://${req.headers.host}`)
    const file = await resolveFile(webroot, url)
    // TODO: distinguish between ACCESS and EXISTS
    //       those should yield different error messages to the user
    if (!file) return next()
    console.log('[handcar.mw.autoIndexHandler]', req.url, '=>', file)
    const stream = createReadStream(file)
    stream.pipe(res)
    stream.on('error', error => {
      res.statusCode = 500
      console.error(error)
      res.end()
    })
    stream.on('finish', () => res.end())
  }

  function rootHandler (req:IncomingMessage, res:ServerResponse) {
    console.log('[handcar.mw.rootHandler] url:', req.url)
    const url = new URL(req.url || '', `http://${req.headers.host}`)
    let next
    for (const mw of middleware) {
      if (url.pathname.startsWith(mw.path)) {
        const $next = next
        next = () => mw.handler(req, res, $next)
      }
    }
    next()
  }

  if (requestListener) {
    use('/', requestListener)
  }

  function use (path:string, handler:Function) {
    console.log('[handcar] use:', path)
    
  }

  // TODO: https options { key, cert }
  const serverOptions = {}
  const server = https
    ? createHttpsServer(serverOptions, rootHandler)
    : createHttpServer(serverOptions, rootHandler)
  
  const app = Object.assign(server, { use })
  app.use('/', staticMiddleware(webroot))
  
  app.listen(port, host, () => console.log(`⚡ hosting "${webroot}" at http://${host}:${port}`))
  return app
}

export function routerMiddleware (): {[method:string]: Middleware} {
  
  return {
    get (path: string, handler: Handler) {
      
    },
    put () {},
    post () {},
    delete () {}
  }  
}

export function staticMiddleware (path) {
  return function staticHandler (req, res, next) {

    console.warn('NYI!')
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