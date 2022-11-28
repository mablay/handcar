// A super lightweight web server
import { createServer as createHttpServer } from 'http'
import { createServer as createHttpsServer } from 'https'
// import { createSecureServer as createHttp2Server } from 'http2'
import { staticMiddleware } from './mw/static.js'
import { notFoundHandler } from './mw/not-found.js'
import { routerMiddleware } from './mw/router.js'
import { createMiddlewareStack } from './middleware.js'
import { webSocketFactory } from './plugins/websocket.js'
import { secureServerOptions } from './util.js'

import type { Handler, Handcar } from './types.js'
import { exec } from 'child_process'

const defaultOptions = {
  // webroot: '.',
  host: '127.0.0.1',
  port: 8080,
  https: false,
  watch: true,
  open: false
}

export {
  staticMiddleware,
  routerMiddleware
}

export function createServer (options:any = {}, requestListener:Handler):Handcar {
  const { host, port, https, webroot, watch, open } = Object.assign({}, defaultOptions, options)

  const { rootHandler, use } = createMiddlewareStack()

  // TODO: https options { key, cert }
  const serverOptions = secureServerOptions(https)
  const scheme = https ? 'https' : 'http'
  const server = https
    ? createHttpsServer(serverOptions, rootHandler)
    : createHttpServer(serverOptions, rootHandler)
  
  const app = Object.assign(server, {
    use,
    ws: webSocketFactory(server)
  })

  app.use('/', notFoundHandler)
  app.use('/', staticMiddleware(webroot, app))
  if (requestListener) {
    use('/', requestListener)
  }

  const mode = watch ? 'live' : 'static'
  app.listen(port, host, () => {
    const url = `${scheme}://${host}:${port}`
    console.log(`⚡ ${mode} hosting "${webroot}" at ${url}`)
    if (!open) return
    exec(`open ${url}`)
  })
  return app
}
