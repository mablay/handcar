import { IncomingMessage, Server } from 'http'
import { WSHandler, WSMiddleware } from '../types.js'
import { WebSocketServer } from 'ws'
import { Socket } from 'net'
import { parseUrl } from '../util.js'

type WSSMap = {[path:string]:WebSocketServer}

export function webSocketFactory (server: Server): WSMiddleware {
  const wssMap:WSSMap = {}

  server.on('upgrade', function upgrade(req:IncomingMessage, socket:Socket, head:any) {
    const url = parseUrl(req)
    console.log('[handcar.ws.upgrade]', url.pathname)
  
    const wss = wssMap[url.pathname]
    if (!wss) {
      console.warn(`Client requesting UPGRADE, but no WSS is registered at "${url.pathname}"`)
      socket.destroy()
      return
    }
    wss.handleUpgrade(req, socket, head, function done (ws) {
      console.log('[handcar.ws.handleUpgrade]', req.url)
      wss.emit('connection', ws, req)
    })
  })

  return function webSocketMiddleware (path: string, wsHandler: WSHandler) {
    console.log('[handcar.ws.plugin]', path, wsHandler)
    const wss = new WebSocketServer({ noServer: true })
    wssMap[path] = wss
    wss.on('connection', wsHandler)
  }
}
