#!/usr/bin/env node
import { Command } from 'commander'
import { createServer } from '../index.js'
import pck from '../package.json' assert { type: 'json' }

const { version } = pck
const integer = value => parseInt(value)

const program = new Command()
  .name('handcar')
  .description('development webserver')
  .version(version)
  .option('-s, --https', 'Use HTTPS')
  .option('-H, --host <host>', "Use '0.0.0.0' to expose the server", 'localhost')
  .option('-p, --port <port>', 'The port the webserver will use', integer, 8080)
  .option('-w, --no-watch', 'Prevent watching the webroot for changes')
  .argument('<webroot>', 'path to webroot')
  .parse(process.argv)

const options = program.opts()
options.webroot = program.args[0]
console.log(options)
createServer(options)
