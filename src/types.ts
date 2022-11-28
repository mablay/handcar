import type { Server, IncomingMessage, ServerResponse } from 'http'
import { Socket } from 'net'

export type Callback = (error?: Error|string) => void
export type Handler = (req: IncomingMessage, res: ServerResponse, next: Callback) => void
export type WSHandler = (socket: Socket, req: IncomingMessage) => void
export type Middleware = ((path: string, handler: Handler) => void) | ((handler: Handler) => void)
export type WSMiddleware = (path: string, wsHandler: WSHandler) => void
export type MidllewareStack = { path: string, handler: Handler }[]
export type Handcar = Server & {
  use: Middleware,
  ws: WSMiddleware
}
