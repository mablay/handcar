// A super lightweight web server
import { createServer as createHttpServer } from 'http'
import { createServer as createHttpsServer } from 'https'
import { staticMiddleware } from './mw/static.js'
import { notFoundHandler } from './mw/not-found.js'
import { routerMiddleware } from './mw/router.js'
import { createMiddlewareStack } from './middleware.js'
import { webSocketFactory } from './plugins/websocket.js'

import type { Handler, Handcar } from './types.js'

const defaultOptions = {
  // webroot: '.',
  host: '127.0.0.1',
  port: 8080,
  https: false,
  watch: true
}

export {
  staticMiddleware,
  routerMiddleware
}

export function createServer (options:any = {}, requestListener:Handler):Handcar {
  const { host, port, https, webroot } = Object.assign({}, defaultOptions, options)

  const { rootHandler, use } = createMiddlewareStack()

  // TODO: https options { key, cert }
  const serverOptions = {}
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

  app.listen(port, host, () => console.log(`⚡ hosting "${webroot}" at http://${host}:${port}`))
  return app
}
