\# 🩺 RepoDoctor



> \*\*Your AI assistant wrote the code. Now find out why it won't run.\*\*



RepoDoctor is a lightweight, zero-dependency, local CLI tool designed specifically for developers using AI code generators (like Claude Engineer, ChatGPT, Bolt, or Aider). 



When AI modifies or generates a project, it frequently misses environment configurations, forgets to tell you to install dependencies, or breaks package scripts. RepoDoctor diagnoses these issues instantly and generates a structured Markdown report that you can \*\*feed straight back into your AI\*\* to get a flawless fix.



\---



\## 🚀 Key Features



\* \*\*Zero Dependencies:\*\* Pure, native Node.js. Runs instantly without bloated installations.

\* \*\*Smart Environment Auditing:\*\* Automatically matches `.env.example` against your active `.env` file to catch missing secret keys.

\* \*\*Dependency Validation:\*\* Instantly flags if your `node\_modules` folder is broken, missing, or corrupted.

\* \*\*Build Script Verification:\*\* Ensures critical runtime hooks like `build` and `dev` are properly mapped inside `package.json`.

\* \*\*AI-Ready Outputs:\*\* Exports a clean `AI\_DEBUG\_REPORT.md` designed specifically to optimize LLM context prompts.



\---



\## 🛠️ Quick Start



You don't need to install anything globally. Simply run the doctor directly inside any broken project folder:



```bash

node /path/to/RepoDoctor/index.js

```



\### Example Diagnosis Output (`AI\_DEBUG\_REPORT.md`)



```markdown

\# RepoDoctor AI Debug Diagnosis Report



\## ⚠️ Environment Variables

\* \*\*Status:\*\* Action Required

\* \*\*Missing Keys:\*\* `DATABASE\_URL`, `NEXT\_PUBLIC\_STRIPE\_KEY`

\* \*\*Fix:\*\* Add these variables to your local `.env` file.



\## 📦 Dependencies

\* \*\*Status:\*\* Pass

\* `package.json` found and `node\_modules` is healthy.



\## ⚙️ Package Scripts

\* \*\*Status:\*\* Warning

\* Missing critical script: `build`

```



\---



\## 🤝 How to Use with AI Chatbots



1\. Run RepoDoctor in your broken directory.

2\. Open the generated `AI\_DEBUG\_REPORT.md`.

3\. Copy the contents and paste them into ChatGPT, Claude, or your LLM agent with this prompt: 

&#x20;  > \*"My project fails to run. Here is the structural diagnosis report from RepoDoctor. Please provide the code fixes to resolve these issues."\*



\---



\## 📜 License



MIT License. Free to use, modify, and build upon.



