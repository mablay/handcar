/** *********************************************
### CLI argument parser

This code is actually pretty ugly and the format
it produces works for the required use case but
it's also ugly.
This is a good candidate for userland replacement.

@see https://www.npmjs.com/package/arg
*********************************************** */
export function arg (options:any = {}) {
  const nameMap = Object.entries(options).reduce((acc, [key, val]:any) => ({ ...acc, [key]: val[0]}), {})
  const castMap = Object.entries(options).reduce((acc, [_key, val]:any) => ({ ...acc, [val[0]]: val[1]}), {})
  
  const [...tokens] = process.argv.slice(2)
  /** for args({ f: 'file' }) the arguments: -f, --file will yield a key of 'file' */
  let key = ''
  /** -f foo bar -f lorem => { file: [['foo', 'bar'], ['lorem']]} */
  const params = {}
  for (const token of tokens) {
    if (token.startsWith('-')) {
      // KEY
      if (token.startsWith('--')) {
        key = token.substring(2)
      } else {
        key = nameMap[token.substring(1)]
      }
      if (!key) throw new Error(`Unkonw argument "${token}"!`)
      appendValue(params, key, [])
    } else {
      // VALUE
      if (!key) throw new Error(`Missing parameter before value "${token}"!`)
      const transform:Function = castMap[key] || (x => x)
      const value = transform(token)
      const i = params[key].length - 1
      appendValue(params[key], i, value)
    }
  }
  return params
}

function appendValue (params:any, key:any, value: any) {
  if (Array.isArray(params[key])) {
    params[key].push(value)
  } else {
    params[key] = [value]
  }
}
