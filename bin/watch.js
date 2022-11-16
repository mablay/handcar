#!/usr/bin/env node

import { arg, watch } from '../index.js'

const toArray = x => Array.isArray(x) ? x : [x]
const { path, cmd, delay } = arg({
  d: ['delay', (x = '200') => parseInt(x)],
  p: ['path', toArray],
  c: ['cmd', toArray]
})

console.log('path:', path)
console.log('cmd:', cmd)
watch(path, cmd, delay)