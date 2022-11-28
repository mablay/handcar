
# Handcar

Lightweight web server inspired by express, connect.

As the name suggests it's heavily inferiour to [express](https://www.npmjs.com/package/express). It focusses only on the most useful features and provides them without dependencies, except [ws](https://www.npmjs.com/package/ws). Which is a great library for server side WebSocket implementation and has no dependencies itself.

STATUS: Experimental!

## Features

* HTTP/HTTPS
* WebSockets
* Static file hosting
* Live reload client page

## Usage

```js
import { createServer } from 'handcar'

const app = createServer({
  host: '0.0.0.0',
  port: 8080,
  https: false,
  webroot: '.',
  watch: true
})
```

## Sources
That helped me build handcar

* [WebSocket Protocol RFC](https://www.rfc-editor.org/rfc/rfc6455)
* [How to implement a websocket server](https://dustinpfister.github.io/2019/11/20/nodejs-websocket/)
* [express](https://expressjs.com/)
