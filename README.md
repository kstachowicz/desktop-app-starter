# desktop-app-starter

Starter template for future desktop apps built with Electron, React, and better-sqlite3.

## Prerequisites (install these first)

Before you can build or run the app you need two things on your computer: **Node.js** and **C++ build tools** (required by the SQLite database library).

### 1. Install Node.js

Node.js gives you the `npm` command used in every step below.

1. Go to <https://nodejs.org>
2. Download the **LTS** version (the big green button)
3. Run the installer — accept all defaults
4. Verify it worked by opening a terminal and running:
   ```
   node --version
   npm --version
   ```
   Both commands should print a version number (e.g. `v22.x.x` and `10.x.x`).

> **What is a terminal?**
> - **Windows**: press `Win + R`, type `cmd`, and press Enter. Or search for "PowerShell" in the Start menu.
> - **macOS**: open **Terminal** from Applications → Utilities.

### 2. Install C++ build tools

The app uses a native SQLite library that must be compiled on your machine.

#### Windows

The easiest way is to run this single command **in an Administrator PowerShell** (right-click PowerShell → "Run as administrator"):

```powershell
npm install -g windows-build-tools
```

Alternatively, install **Visual Studio Build Tools** from <https://visualstudio.microsoft.com/visual-cpp-build-tools/> and select the "Desktop development with C++" workload.

#### macOS

Install the Xcode Command Line Tools by running:

```bash
xcode-select --install
```

A dialog will appear — click **Install** and wait for it to finish.

---

Once both steps are done you are ready to go. Continue with **Quick start** below.

## Run in GitHub Codespaces (no install needed)

You can run this app entirely in your browser — no Node.js, no build tools, nothing to install.

1. On the GitHub repo page, click the green **`<> Code`** button
2. Switch to the **Codespaces** tab
3. Click **Create codespace on main**
4. Wait for the setup to finish (a few minutes the first time)
5. A **"Desktop"** tab will open automatically in your browser — that's the app running

> If the Desktop tab doesn't open on its own, go to the **Ports** panel at the bottom of the editor and click the globe icon next to port **6080**.

That's it — the app builds, installs, and launches automatically inside the Codespace.

## Stack

- Electron Forge
- Vite
- TypeScript
- React
- better-sqlite3

## Quick start

```bash
npm install
npm start
```

Package the app for the current platform:

```bash
npm run make
```

Run the smoke test:

```bash
npm test
```

Build and deploy a local production install:

```bash
npm run deploy:windows
```

```bash
npm run deploy:macos
```

## Architecture

The app is split into three clear layers:

- `src/main`: privileged Electron and database code
- `src/preload`: the safe bridge exposed to the renderer
- `src/renderer`: the React UI

Flow:

`renderer -> preload -> ipcMain -> database`

The renderer never imports Node.js modules or talks to SQLite directly.

## How to add a new feature

To add a new backend-powered feature:

1. Add a function in `src/main/database.ts` or `src/main/main.ts`
2. Register it in `src/main/api.ts`

That registration is the template's core convention. The preload layer exposes the same methods under `window.api`.

## How to add a new page

Add a React component under `src/renderer` and render it from `src/renderer/App.tsx`.

## How to change the app icon

You need two files:

- `icon.ico` for Windows
- `icon.icns` for macOS

Put them in an `assets` folder in the project root.

Then update:

- `forge.config.ts` to use `./assets/icon`
- `src/main/main.ts` to set the development window icon

After that, rebuild the app:

```bash
npm run make
```

## Production deploy scripts

- Windows: `npm run deploy:windows`
- macOS: `npm run deploy:macos`

What they do:

- install dependencies if `node_modules` is missing
- build production artifacts with `npm run make`
- install the app locally
- create a desktop shortcut

Platform behavior:

- Windows runs the generated Squirrel `Setup.exe` and creates a desktop `.lnk` shortcut
- macOS copies the built `.app` bundle to `/Applications` and creates a Desktop symlink to it

## Included on purpose

- Flat folder structure for easier Copilot-assisted changes
- Typed preload API
- Local SQLite bootstrap with a visible hello message
- Windows packaging now, macOS-ready maker config for later
- Smoke test command that launches the app and verifies the SQLite message renders

## Deliberately excluded from the first cut

- Auto-update
- Code signing
- macOS notarization
- Database migrations
- CI/CD workflows
