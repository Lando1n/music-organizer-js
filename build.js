const { compile } = require('nexe');

compile({
  input: './src/index.js',
  build: true,
  output: './output/music-organizer-js',
  target: 12
}).then(() => {
  console.log('success');
});
