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

const SOURCE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];
const SOURCE_FILE_REGEX = /\.(js|jsx|ts|tsx)$/;

const REQUIRE_REGEX = /require\(['"](\.\.?\/[^'"]+)['"]\)/g;
const IMPORT_FROM_REGEX = /import\s+(?:[^'"]*?\s+from\s+)?['"](\.\.?\/[^'"]+)['"]/g;
const IMPORT_SIDEEFFECT_REGEX = /import\s*['"](\.\.?\/[^'"]+)['"]/g;

function shouldSkipDirectory(dirName) {
  if (dirName === 'node_modules') {
    return true;
  }
  if (dirName.startsWith('.')) {
    return true;
  }
  return false;
}

function walkSourceFiles(dir, fileList) {
  fileList = fileList || [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    return fileList;
  }
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (shouldSkipDirectory(entry.name)) {
        continue;
      }
      walkSourceFiles(fullPath, fileList);
    } else if (entry.isFile() && SOURCE_FILE_REGEX.test(entry.name)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function relativeFileExists(fileDir, importPath) {
  const resolved = path.join(fileDir, importPath);
  if (fs.existsSync(resolved)) {
    return true;
  }
  const alreadyHasExtension = SOURCE_EXTENSIONS.some((ext) =>
    importPath.endsWith(ext)
  );
  if (!alreadyHasExtension) {
    for (const ext of SOURCE_EXTENSIONS) {
      if (fs.existsSync(resolved + ext)) {
        return true;
      }
    }
  }
  return false;
}

function checkImports() {
  const cwd = process.cwd();
  const missing = [];
  const seen = new Set();

  const sourceFiles = walkSourceFiles(cwd);

  for (const filePath of sourceFiles) {
    let content;
    try {
      content = fs.readFileSync(filePath, 'utf8');
    } catch (err) {
      continue;
    }

    const fileDir = path.dirname(filePath);

    const regexes = [REQUIRE_REGEX, IMPORT_FROM_REGEX, IMPORT_SIDEEFFECT_REGEX];
    for (const regex of regexes) {
      regex.lastIndex = 0;
      let match;
      while ((match = regex.exec(content)) !== null) {
        const importPath = match[1];
        const resolved = path.join(fileDir, importPath);
        if (!relativeFileExists(fileDir, importPath)) {
          const key = path.resolve(resolved);
          if (!seen.has(key)) {
            seen.add(key);
            missing.push(resolved);
          }
        }
      }
    }
  }

  return missing;
}

module.exports = {
  checkEnvKeys,
  checkDependencies,
  checkScripts,
  checkImports,
};
