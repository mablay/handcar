#!/usr/bin/env node

import { arg, watch } from '../index.js'

const { path, cmd, delay } = arg({
  d: ['delay', (x = '200') => parseInt(x)],
  p: ['path'],
  c: ['cmd']
})

watch(path.flat(), cmd, delay[0][0])