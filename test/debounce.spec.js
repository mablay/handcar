import { test } from 'zora'
import { debounce } from '../index.js'

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

test('debounce sync', async t => {
  let counter = 0
  const increment = debounce(50, () => counter++)
  t.eq(counter, 0, 'initial value')
  increment()
  increment()
  await wait(20)
  increment()
  t.eq(counter, 0, 'waiting')
  await wait(100)
  t.eq(counter, 1, 'resolved')
})

test('debounce asyn sync', async t => {
  let counter = 0
  const increment = debounce(100, () => wait(50).then(() => counter++))
  t.eq(counter, 0, 'initial value')
  increment() // => 150
  await wait(100) // 100
  t.eq(counter, 0, 'running')
  increment() // => 250
  await wait(100) // 200
  t.eq(counter, 1, 'resolved first')
  await wait(100) // 300
  t.eq(counter, 2, 'resolved second')
})
