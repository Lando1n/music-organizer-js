const { organize } = require('./organize');
const { runSetup } = require('./setup');

const args = process.argv.slice(2)[0];

async function main() {
  switch (args) {
    case 'setup':
      try {
        await runSetup();
        console.log('Setup Complete. You are now ready to organize!');
      } catch (e) {
        console.error(`Music Organizer setup failed due to: ${e}`);
      }
      break;
    case 'organize':
    case undefined:
      try {
        const songsMoved = await organize();
        if (!songsMoved || songsMoved === 0) {
          console.warn(
            "It appears I haven't moved any files, you sure that is the directory you're looking for? Maybe consider running setup again.\n"
          );
        } else {
          console.log(`Songs Moved: ${songsMoved}`);
        }
        console.log('Complete.');
      } catch (e) {
        console.error(`Music Organizer failed due to: ${e}`);
      }
      break;
    default:
      console.error(
        'Unsupported argument. Select either "setup" or "organize"'
      );
      break;
  }
}

main();
