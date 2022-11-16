
/** execute target function after it has not been invoked for a certain time */
export function debounce (millis, fn) {
  let lastCall = 0
  let timeout: NodeJS.Timer|null = null
  let busy = false
  let queue: null|(() => void) = null

  async function dequeue () {
    if (timeout) clearTimeout(timeout)
    timeout = null
    if (busy) return
    if (!queue) return
    const task = queue
    queue = null
    busy = true
    lastCall = Date.now()
    await task()
    busy = false
    if (!queue) return
    const wait = lastCall + millis - Date.now()
    if (wait <= 0) {
      dequeue()
    } else {
      timeout = setTimeout(dequeue, wait)
    }
  }

  return function enqueue (...args) {
    if (timeout !== null) {
      clearTimeout(timeout)
    }
    queue = () => fn(...args)
    timeout = setTimeout(dequeue, millis)
  }
}
