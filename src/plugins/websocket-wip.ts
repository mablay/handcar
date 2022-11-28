import { createHash } from 'crypto'
import { IncomingMessage, Server } from "http"
import { Socket } from 'net'
import { Handler } from '../types.js'

// Very Simple Web Socket server
export function handleWsUpgrade (server) {

  let socket: Socket

  // upgrade handler
  server.on('upgrade', (req, socket, head) => {
    console.log('[handcar.on.upgrade] head', head)
    // accept upgrade
    socket.on('connect', (ev) => {
      console.log('[handcar.ws] CONNECT', ev)
    })
    socket.on('data', data => {
      console.log('[handcar.ws] DATA', data.toString('base64'))
    })
    acceptUpgrade(req, socket)
    sendTextFrame(socket, 'foo')
    // send simple text frame
    //sendTextFrame(socket, 'Hello')
    // opt.onReady({
    //   socket: socket,
    //   sendText: function (text) {
    //     sendTextFrame(this.socket, text)
    //   }
    // }, socket)
  })

  return {
    send (msg: string) {
      if (!socket) throw new Error('No socket connection!')
      sendTextFrame(socket, msg)
    },
    get socket () {
      return socket
    }
  }
}

// generate the accept key for the upgrade request
function genAcceptKey (req: IncomingMessage) {
  const key = req.headers['sec-websocket-key']
  const sha1 = createHash('sha1')
  sha1.update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
  return sha1.digest('base64')
}

// accept upgrade handler for upgrade event
function acceptUpgrade (req: IncomingMessage, socket: Socket) {
  // gen accept key
  let acceptKey = genAcceptKey(req)
  // write response
  socket.write(
    'HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
    'Upgrade: WebSocket\r\n' +
    'Connection: Upgrade\r\n' +
    'Sec-WebSocket-Accept: ' + acceptKey + '\r\n' +
    '\r\n'
  )
}

// simple send text frame helper
function sendTextFrame (socket: Socket, text: string) {
  let firstByte = 0x00
  let secondByte = 0x00
  // const payloadLength = Buffer.from([0, 0])
  let payload = Buffer.alloc(text.length)
  payload.write(text)
  firstByte |= 0x80 // fin bit true
  firstByte |= 0x01 // opt code of 1 (text)
  secondByte |= text.length // mask and payload len
  let frame = Buffer.concat([Buffer.from([firstByte]), Buffer.from([secondByte]), payload])
  socket.write(frame)
}

export function wsMiddleware(_server: Server, _handler: Handler) {
  // ...
}
