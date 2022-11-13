// A super lightweight web server
// import { readFileSync } from 'node:fs'
import { createServer as createHttpServer } from 'http'
import { createServer as createHttpsServer } from 'https'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const defaultOptions = {
  host: '127.0.0.1',
  port: 9090,
  https: false,
  watch: []
}

export function createServer (options = {}, requestListener) {
  const { host, port, https, watch } = Object.assign({}, defaultOptions, options)

  const server = https
    ? createHttpsServer(options, requestListener)
    : createHttpServer(options, requestListener)
  
  server.listen(port, host)

  return {
    server,
    use (path:string, handler:Function) {

    }
  }
}

export function routerMiddleware () {
  
  return {
    get () {},
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
