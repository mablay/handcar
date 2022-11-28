// this script is injected on the client side
// this file has a .ts ending so it gets bundled
// but don't write actual typescript in here!

export function handcarLive (url) {
  console.log('[handcar] connecting websocket for live reload')
  // @ts-ignore
  const ws = new WebSocket(url)
  ws.addEventListener('open', () => {
    console.log('sending data via WS')
    ws.send('hello from client')
  })
  ws.addEventListener('message', ({ data }) => {
    console.log('ws MESSAGE:', data)
    if (data === 'reload') {
      // @ts-ignore
      window.location.reload()
    }
  })
}
