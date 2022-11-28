// example for programatic use of handcar

import { createServer } from "../index.js"

const app = createServer({
  host: '0.0.0.0',
  port: 8080,
  https: true,
  webroot: 'example',
  watch: true
})

// app.ws('/ws', (req, ws) => {
//   ws.on('message', msg => ws.send("Thank's, got your message!"))
// })
