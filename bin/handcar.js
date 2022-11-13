#!/usr/bin/env node

import { createServer, wsMiddleware } from '../index.js'

const app = createServer({
  host: '0.0.0.0',
  port: 8080,
  https: true,
  watch: ['public'],
  static: 'public'
})

app.use('/ws', wsMiddleware(app.server, (ws, req) => {
  ws.on('message', msg => ws.send("Thank's, got your message!"))
}))
