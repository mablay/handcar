import { Handler, Middleware } from '../types.js'

export function routerMiddleware (): {[method:string]: Middleware} {
  
  return {
    get (path: string, handler: Handler) {
      
    },
    put () {},
    post () {},
    delete () {}
  }  
}
