const { compile } = require('nexe')

compile({
  input: './src/index.js',
  build: true,
}).then(() => {
  console.log('success')
})