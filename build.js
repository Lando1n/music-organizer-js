const { compile } = require('nexe');

// Build linux
compile({
  input: './src/entrypoint.js',
  target: 'linux-x64-14.15.3',
  output: './dist/music-organizer-js'
}).then(() => {
  console.log('success');
});
// Build Windows
compile({
  input: './src/entrypoint.js',
  target: 'windows-x64-14.5.0',
  output: './dist/music-organizer-js'
}).then(() => {
  console.log('success');
});
// Build Mac
compile({
  input: './src/entrypoint.js',
  target: 'mac-x64-14.15.3',
  output: './dist/music-organizer-js-mac'
}).then(() => {
  console.log('success');
});
