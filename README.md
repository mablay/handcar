
# Handcar

Lightweight development web server inspired by express, connect.

As the name suggests it's heavily inferior to [express](https://www.npmjs.com/package/express). It focusses only on the most useful features and provides them without dependencies, except [ws](https://www.npmjs.com/package/ws). Which is a great library for server side WebSocket implementation and has no dependencies itself.

STATUS: Working, but in development.

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
  https: true,
  webroot: '.',
  watch: true
})
```

Setting `https` to true, will generate `localhost-cert.pem` and `localhost-key.pem` files in your CWD if they don't allready exist.

## Sources
That helped me build handcar

* [WebSocket Protocol RFC](https://www.rfc-editor.org/rfc/rfc6455)
* [How to implement a websocket server](https://dustinpfister.github.io/2019/11/20/nodejs-websocket/)
* [express](https://expressjs.com/)
* `example/favicon.ico` from [Handcar icons created by Freepik - Flaticon](https://www.flaticon.com/free-icons/handcar)