import { template404 } from "../templates/templates.js"

export function notFoundHandler (_req, res) {
  console.log('[handcar.mw.notFoundHandler]', _req.url)
  res.statusCode = 404
  res.end(template404)
}
