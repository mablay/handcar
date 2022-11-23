#!/usr/bin/env node

import { createServer, wsMiddleware } from '../index.js'

const webroot = process.argv[2] || '.'

const app = createServer({
  host: '0.0.0.0',
  port: 8080,
  https: false,
  webroot,
  watch: true
})

app.use('/ws', wsMiddleware(app, (ws, req) => {
  ws.on('message', msg => ws.send("Thank's, got your message!"))
}))
