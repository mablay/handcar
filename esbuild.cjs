require('esbuild').build({
  entryPoints: ['src/index.ts'],
  // target: 'esnext',
  bundle: true,
  outfile: 'index.js',
  external: 'url,path,http,https,crypto,fs,child_process'.split(','),
  platform: 'neutral',
  sourcemap: true,
  watch: process.argv.slice(2).includes('--watch')
}).catch(() => process.exit(1))