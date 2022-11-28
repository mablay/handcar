import { IncomingMessage, ServerResponse } from "http"
import { Handler, MidllewareStack } from "./types.js"

export function createMiddlewareStack () {
  const middleware: MidllewareStack = []

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
  
  function use (path:string, handler:Handler) {
    console.log('[handcar] use:', path, handler)
    middleware.push({ path, handler })
  }

  return { use, rootHandler }
}
