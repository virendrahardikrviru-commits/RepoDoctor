const fs = require('fs');
const path = require('path');
const { checkEnvKeys, checkDependencies, checkScripts, checkImports } = require('./diagnostics');

function bullet(text) {
  return '- ' + text;
}

function formatEnvSection(result) {
  const lines = [];
  lines.push('## 1. Environment Variables');
  lines.push('');

  if (!result.exampleExists) {
    lines.push(bullet('No `.env.example` file found.'));
    lines.push('');
    return lines.join('\n');
  }

  lines.push(bullet('`.env.example` exists: yes'));
  lines.push(bullet('`.env` exists: ' + (result.envExists ? 'yes' : 'no')));
  lines.push(
    bullet('Example keys: ' + (result.exampleKeys.length ? result.exampleKeys.join(', ') : 'none'))
  );
  if (result.envExists) {
    lines.push(
      bullet('`.env` keys: ' + (result.envKeys.length ? result.envKeys.join(', ') : 'none'))
    );
  }
  if (result.missingKeys.length) {
    lines.push(bullet('**Missing keys:** ' + result.missingKeys.join(', ')));
  } else {
    lines.push(bullet('**Missing keys:** none'));
  }
  lines.push('');
  return lines.join('\n');
}

function formatDepsSection(result) {
  const lines = [];
  lines.push('## 2. Dependencies');
  lines.push('');

  if (!result.packageJsonExists) {
    lines.push(bullet('No `package.json` file found.'));
    lines.push('');
    return lines.join('\n');
  }

  lines.push(bullet('`package.json` exists: yes'));
  lines.push(bullet('`node_modules` exists: ' + (result.nodeModulesExists ? 'yes' : 'no')));
  if (result.nodeModulesExists) {
    lines.push(bullet('`node_modules` empty: ' + (result.nodeModulesEmpty ? 'yes' : 'no')));
  }
  if (result.missing) {
    lines.push(bullet('**Status:** dependencies missing or incomplete'));
  } else {
    lines.push(bullet('**Status:** dependencies installed'));
  }
  lines.push('');
  return lines.join('\n');
}

function formatScriptsSection(result) {
  const lines = [];
  lines.push('## 3. Scripts');
  lines.push('');

  if (!result.packageJsonExists) {
    lines.push(bullet('No `package.json` file found.'));
    lines.push('');
    return lines.join('\n');
  }

  lines.push(bullet('`build` script: ' + (result.hasBuild ? 'present' : 'missing')));
  lines.push(bullet('`dev` script: ' + (result.hasDev ? 'present' : 'missing')));
  if (result.missingEssential.length) {
    lines.push(bullet('**Missing essential scripts:** ' + result.missingEssential.join(', ')));
  } else {
    lines.push(bullet('**Missing essential scripts:** none'));
  }
  lines.push('');
  return lines.join('\n');
}

function formatImportsSection(missing) {
  const lines = [];
  lines.push('## 🔍 Code Import Links');
  lines.push('');

  if (missing.length === 0) {
    lines.push(bullet('No broken relative `require()` imports found.'));
    lines.push('');
    return lines.join('\n');
  }

  lines.push(bullet('**Broken imports detected:**'));
  for (const missingFile of missing) {
    lines.push(bullet('Missing: `' + missingFile + '`'));
  }
  lines.push('');
  return lines.join('\n');
}

function generateReport() {
  const cwd = process.cwd();
  const envResult = checkEnvKeys();
  const depsResult = checkDependencies();
  const scriptsResult = checkScripts();
  const importsResult = checkImports();

  const lines = [];
  lines.push('# AI Debug Report');
  lines.push('');
  lines.push('Generated: ' + new Date().toISOString());
  lines.push('Directory: ' + cwd);
  lines.push('');
  lines.push(formatEnvSection(envResult));
  lines.push(formatDepsSection(depsResult));
  lines.push(formatScriptsSection(scriptsResult));
  lines.push(formatImportsSection(importsResult));
  lines.push('---');
  lines.push('End of report.');

  return lines.join('\n');
}

const report = generateReport();
const outputPath = path.join(process.cwd(), 'AI_DEBUG_REPORT.md');
fs.writeFileSync(outputPath, report, 'utf8');

console.log('AI_DEBUG_REPORT.md written to ' + outputPath);
