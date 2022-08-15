const { compile } = require('nexe');

const arg = process.argv.slice(2)[0];

switch (arg) {
  case 'linux':
    buildLinux();
    break;
  case 'windows':
    buildWindows();
    break;
  case 'mac':
    buildMac();
    break;
  default:
    buildLinux();
    buildWindows();
    buildMac();
    break;
}

function buildLinux() {
  // Build linux
  compile({
    input: './src/entrypoint.js',
    target: 'linux-x64-14.15.3',
    output: './dist/music-organizer-js'
  }).then(() => {
    console.log('success');
  });
}

function buildWindows() {
  // Build Windows
  compile({
    input: './src/entrypoint.js',
    target: 'windows-x64-14.5.0',
    output: './dist/music-organizer-js'
  }).then(() => {
    console.log('success');
  });
}

function buildMac() {
  // Build Mac
  compile({
    input: './src/entrypoint.js',
    target: 'mac-x64-14.15.3',
    output: './dist/music-organizer-js-mac'
  }).then(() => {
    console.log('success');
  });
}
