const { execSync } = require('child_process');
const path = require('path');

function runCommand(command, description) {
  console.log('> ' + description + '...');
  try {
    execSync(command, { stdio: 'inherit', cwd: __dirname });
    console.log('✓ ' + description + ' completed.');
  } catch (err) {
    console.error('✗ ' + description + ' failed.');
    console.error(err.message);
    process.exit(1);
  }
  console.log('');
}

function main() {
  console.log('RepoDoctor Setup v1.2.1');
  console.log('========================');
  console.log('');

  const repoDir = path.resolve(__dirname);

  console.log('Working directory: ' + repoDir);
  console.log('');

  runCommand('npm install', 'Installing local dependencies');
  runCommand('npm link', 'Globally linking repodoctor command');

  console.log('========================');
  console.log('Setup complete.');
  console.log('You can now run RepoDoctor from anywhere using: repodoctor');
}

main();
