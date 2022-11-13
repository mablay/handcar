
# Handcar

Lightweight web server inspired by express, connect.

## Features

* HTTP/HTTPS
* Static file hosting
* Watch mode
* WebSockets

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