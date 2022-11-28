#!/usr/bin/env node

import { createServer } from '../index.js'

const webroot = process.argv[2] || '.'

const app = createServer({
  host: '0.0.0.0',
  port: 8080,
  https: false,
  webroot,
  watch: true
})

// app.ws('/ws', (req, ws) => {
//   ws.on('message', msg => ws.send("Thank's, got your message!"))
// })
