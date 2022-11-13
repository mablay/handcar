//  src/index.ts --bundle --platform=neutral --external:url --external:path --outfile=index.js
require('esbuild').build({
  entryPoints: ['src/index.ts'],
  // target: 'esnext',
  bundle: true,
  outfile: 'index.js',
  external: ['url', 'path', 'http', 'https', 'crypto'],
  platform: 'neutral',
  sourcemap: true,
}).catch(() => process.exit(1))