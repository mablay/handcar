
# Handcar

Lightweight web server inspired by express, connect.

## Features (and their implementation progress)

* [0.5] HTTP/HTTPS
* [0.5] Static file hosting
* [1.0] Watch mode
* [0.0] WebSockets

## Usage

```js
import { createServer, wsMiddleware } from 'handcar'

const server = createServer({
  host: '0.0.0.0',
  port: 8080,
  https: true,
  watch: ['public'],
  static: 'public'
})

server.use('/ws', wsMiddleware(server, (ws, req) => {
  ws.on('message', msg => ws.send("Thank's, got your message!"))
}))
```

## Sources
That helped me build handcar

* [WebSocket Protocol RFC](https://www.rfc-editor.org/rfc/rfc6455)
* [How to implement a websocket server](https://dustinpfister.github.io/2019/11/20/nodejs-websocket/)
* [express](https://expressjs.com/)
