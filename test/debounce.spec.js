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
  const increment = debounce(50, () => wait(50).then(() => counter++))
  t.eq(counter, 0, 'initial value')
  increment()
  await wait(75) // 75
  t.eq(counter, 0, 'running')
  increment()
  await wait(75) // 150
  t.eq(counter, 1, 'resolved first')
  await wait(50) // 200
  t.eq(counter, 2, 'resolved second')
})
