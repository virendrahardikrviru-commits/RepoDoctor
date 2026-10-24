const fs = require('fs');
const path = require('path');

function extractKeysFromEnvFile(filePath) {
  const keys = [];
  try {
    if (!fs.existsSync(filePath)) {
      return keys;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) {
        continue;
      }
      const key = trimmed.slice(0, eqIndex).trim();
      if (key) {
        keys.push(key);
      }
    }
  } catch (err) {
    // Ignore read errors; return whatever keys were collected.
  }
  return keys;
}

function checkEnvKeys() {
  const cwd = process.cwd();
  const examplePath = path.join(cwd, '.env.example');
  const envPath = path.join(cwd, '.env');

  const result = {
    exampleExists: fs.existsSync(examplePath),
    envExists: fs.existsSync(envPath),
    exampleKeys: [],
    envKeys: [],
    missingKeys: [],
  };

  if (result.exampleExists) {
    result.exampleKeys = extractKeysFromEnvFile(examplePath);
    if (result.envExists) {
      result.envKeys = extractKeysFromEnvFile(envPath);
      const envKeySet = new Set(result.envKeys);
      result.missingKeys = result.exampleKeys.filter((key) => !envKeySet.has(key));
    } else {
      result.missingKeys = [...result.exampleKeys];
    }
  }

  return result;
}

function checkDependencies() {
  const cwd = process.cwd();
  const pkgPath = path.join(cwd, 'package.json');
  const modulesPath = path.join(cwd, 'node_modules');

  const result = {
    packageJsonExists: fs.existsSync(pkgPath),
    nodeModulesExists: fs.existsSync(modulesPath),
    nodeModulesEmpty: true,
    missing: false,
  };

  if (result.packageJsonExists && result.nodeModulesExists) {
    try {
      const entries = fs.readdirSync(modulesPath);
      result.nodeModulesEmpty = entries.length === 0;
    } catch (err) {
      result.nodeModulesEmpty = true;
    }
  }

  result.missing =
    !result.packageJsonExists ||
    !result.nodeModulesExists ||
    result.nodeModulesEmpty;

  return result;
}

function checkScripts() {
  const cwd = process.cwd();
  const pkgPath = path.join(cwd, 'package.json');

  const result = {
    packageJsonExists: fs.existsSync(pkgPath),
    scripts: {},
    hasBuild: false,
    hasDev: false,
    missingEssential: [],
  };

  if (result.packageJsonExists) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      result.scripts = pkg.scripts || {};
      result.hasBuild = !!result.scripts.build;
      result.hasDev = !!result.scripts.dev;
      result.missingEssential = ['build', 'dev'].filter(
        (script) => !result.scripts[script]
      );
    } catch (err) {
      // Ignore parse errors; leave defaults.
    }
  }

  return result;
}

module.exports = {
  checkEnvKeys,
  checkDependencies,
  checkScripts,
};
