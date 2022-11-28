
# Handcar

Lightweight development web server inspired by express, connect.

As the name suggests it's heavily inferior to [express](https://www.npmjs.com/package/express). It focusses only on the most useful features and provides them with a minimum of dependencies.

* [ws](https://www.npmjs.com/package/ws) the goto NodeJS WebSocket implementation (zero sub dependencies)
* [commander](https://www.npmjs.com/package/commander) excellent CLI agrument parser (zero sub dependencies)

STATUS: Working, but in development.

## Features

* CLI
* HTTP/HTTPS
* WebSockets
* Static file hosting
* Live reload client page

## CLI
```s
Usage: handcar [options] <webroot>

development webserver

Arguments:
  webroot            path to webroot

Options:
  -V, --version      output the version number
  -s, --https        Use HTTPS
  -H, --host <host>  Use '0.0.0.0' to expose the server (default: "localhost")
  -p, --port <port>  The port the webserver will use (default: 8080)
  -w, --no-watch     Prevent watching the webroot for changes
  -o, --open         Open browser
  -h, --help         display help for command
```
Example:
```sh
# start webserver in local directory using HTTPS and live reload.
handcar -s .
```
## Usage

```js
import { createServer } from 'handcar'

const app = createServer({
  host: '0.0.0.0',
  port: 8080,
  https: false,
  webroot: '.',
  watch: true,
  open: false
})
```

Setting `https` to true, will generate `localhost-cert.pem` and `localhost-key.pem` files in your CWD if they don't allready exist.

## Sources
That helped me build handcar

* [WebSocket Protocol RFC](https://www.rfc-editor.org/rfc/rfc6455)
* [How to implement a websocket server](https://dustinpfister.github.io/2019/11/20/nodejs-websocket/)
* [express](https://expressjs.com/)
* `example/favicon.ico` from [Handcar icons created by Freepik - Flaticon](https://www.flaticon.com/free-icons/handcar)