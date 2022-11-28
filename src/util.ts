import { execSync } from "child_process"
import { accessSync, readFileSync } from "fs"

export function parseUrl (req) {
  const scheme = req.socket.encrypted ? 'https' : 'http'
  return new URL(req.url || '', `${scheme}://${req.headers.host}`)
}

export function secureServerOptions (https):any {
  if (!https) return {}
  if (https === true) {
    try {
      accessSync('localhost-key.pem')      
    } catch (error) {
      // TODO: certificate generation should either go into a dedicated CLI script or happen without touching the filesystem!
      const cmd = "openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' -keyout localhost-key.pem -out localhost-cert.pem"
      execSync(cmd)
    }
    return {
      key: readFileSync('localhost-key.pem'),
      cert: readFileSync('localhost-cert.pem'),
    }
  } else {
    if (!https.key || !https.cert) throw new Error('Invalid "https" config!')
    return {
      key: https.key,
      cert: https.cert
    }
  }
}
