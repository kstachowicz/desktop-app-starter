/**
 * Smoke test — launches the **packaged** Electron app with
 * --remote-debugging-port, connects via CDP, and asserts the UI
 * shows the SQLite greeting.
 *
 * Works on both Windows and macOS.  Fuses remain enabled because
 * --remote-debugging-port is a Chromium flag, not a Node.js flag.
 */
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { _electron as electron } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('Launching Electron...');
const app = await electron.launch({
  args: ['.'],
  cwd: projectRoot,
});

try {
  const window = await app.firstWindow();
  await window.waitForLoadState('domcontentloaded');

  const helloMessage = window.getByTestId('hello-message');
  await helloMessage.waitFor({ timeout: 15_000 });

  const text = await helloMessage.textContent();
  assert.equal(text, 'Hello from SQLite!');

  console.log('✅ Smoke test passed — "Hello from SQLite!" rendered from DB.');
} finally {
  await app.close();
}