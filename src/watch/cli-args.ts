
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
      if (Array.isArray(params[key])) {
        params[key].push([])
      } else {
        params[key] = [[]]
      }
      // setParam(params, key, [])
    } else {
      // VALUE
      if (!key) throw new Error(`Missing parameter before value "${token}"!`)
      const transform:Function = castMap[key] || (x => x)
      const value = transform(token)
      const i = params[key].length - 1
      // console.log(`params[${key}][${i}] = ${value}`)
      setParam(params[key], i, value)
      // params[key][i].push(value)
    }
  }
  return params
}

function setParam (params:any, key:string, value: any) {
  if (params[key]) {
    if (Array.isArray(params[key])) {
      params[key] = params[key].concat(value)
    } else {
      params[key] = [params[key], value]
    }
  } else {
    params[key] = [value]
  }
}


// function parseToken (token:string, nameMap: any = {}, castMap: any = {}) {
//   let key = ''
//   if (token.startsWith('--')) {
//     key = token.substring(2)
//   } else if (token.startsWith('-')) {
//     key = nameMap[token.substring(1)]
//   } else {
//     value = castMap
//   }
//   if (!key || !Object.values(nameMap).includes(key)) {
//     throw new Error(`Unknown key "${token}"!`)
//   }
//   const map = castMap[key]
//   return { key, map }
// }