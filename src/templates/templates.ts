import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))
const errorTemplatePath = join(__dirname, 'src', 'templates', 'error.html')

function generateErrorTemplate (code, title, scale = 1) {
  const html = readFileSync(errorTemplatePath, 'utf8')
  return html
    .replace(/\/\*code\*\//g, code.toString())
    .replace(/\/\*title\*\//g, title)
    .replace(/\/\*scale\*\//g, scale.toString())
}

export const template404 = generateErrorTemplate(404, 'Not Found!', 1)
export const template500 = generateErrorTemplate(500, 'Internal Server Error!', 0.53)
