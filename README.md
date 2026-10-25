![RepoDoctor Banner](banner.svg)

# RepoDoctor

RepoDoctor is a lightweight Node.js CLI tool that analyzes a project directory, catches common mistakes made by AI code generators, and exports a structured Markdown report named `AI_DEBUG_REPORT.md`.

It runs natively out-of-the-box with zero external dependencies, using only built-in Node.js modules.

## Features

- **Environment variable check** — compares `.env.example` keys against `.env` and flags missing keys.
- **Dependency check** — verifies `package.json` exists and `node_modules` is present and non-empty.
- **Scripts check** — confirms essential scripts like `build` and `dev` are defined in `package.json`.
- **Import link check** — recursively scans `.js`, `.jsx`, `.ts`, and `.tsx` files for broken relative `require()` and `import ... from` statements where the target file does not exist on disk.
- **Structured Markdown report** — writes all findings to `AI_DEBUG_REPORT.md` in the target directory.

## Installation

Clone the repository:

```bash
git clone https://github.com/your-username/RepoDoctor.git
```

Navigate into the folder:

```bash
cd RepoDoctor
```

Run the automated installer:

```bash
node setup.js
```

The installer will run `npm install` to prepare local dependencies and `npm link` to globally register the `repodoctor` command on your system.

## Usage

Once installed, you can run RepoDoctor from any project directory:

```bash
repodoctor
```

This scans the current working directory and generates `AI_DEBUG_REPORT.md` with findings organized into these sections:

- **1. Environment Variables** — missing keys between `.env.example` and `.env`
- **2. Dependencies** — missing or incomplete `node_modules`
- **3. Scripts** — missing `build` or `dev` scripts
- **🔍 Code Import Links** — broken relative imports across `.js`, `.jsx`, `.ts`, and `.tsx` files

## Report Format

The generated `AI_DEBUG_REPORT.md` follows a clean Markdown structure:

```markdown
# AI Debug Report

Generated: 2026-10-25T...
Directory: /path/to/your/project

## 1. Environment Variables
- `.env.example` exists: yes
- `.env` exists: no
- **Missing keys:** API_KEY, DATABASE_URL

## 2. Dependencies
- `package.json` exists: yes
- `node_modules` exists: no
- **Status:** dependencies missing or incomplete

## 3. Scripts
- `build` script: missing
- `dev` script: missing
- **Missing essential scripts:** build, dev

## 🔍 Code Import Links
- **Broken imports detected:**
- Missing: `./src/utils/helper`

---
End of report.
```

## Requirements

- Node.js (v14 or higher recommended)
- No external npm dependencies required

## License

ISC