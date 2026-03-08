// This file creates the app window and registers the safe IPC surface.
// Modify it when you need Electron lifecycle behavior or to register more APIs.

import { app, BrowserWindow, ipcMain, shell } from 'electron';
import type { IpcMainInvokeEvent } from 'electron';
import started from 'electron-squirrel-startup';
import path from 'node:path';

import type { ApiMethodName } from '../api';
import { apiHandlers } from './api';

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;
declare const MAIN_WINDOW_VITE_NAME: string;

if (started) {
  app.quit();
}

const isTrustedSender = (event: IpcMainInvokeEvent): boolean => {
  const senderFrame = event.senderFrame;

  if (!senderFrame || !senderFrame.url) {
    return false;
  }

  if (senderFrame.url.startsWith('file://')) {
    return true;
  }

  if (!MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    return false;
  }

  try {
    const trustedOrigin = new URL(MAIN_WINDOW_VITE_DEV_SERVER_URL).origin;
    return new URL(senderFrame.url).origin === trustedOrigin;
  } catch {
    return false;
  }
};

const registerApiHandlers = (): void => {
  (Object.entries(apiHandlers) as [ApiMethodName, typeof apiHandlers[ApiMethodName]][]).forEach(
    ([channel, handler]) => {
      ipcMain.removeHandler(channel);
      ipcMain.handle(channel, async (event) => {
        if (!isTrustedSender(event)) {
          throw new Error(`Blocked IPC call for channel: ${channel}`);
        }

        return handler();
      });
    },
  );
};

const createWindow = (): BrowserWindow => {
  const mainWindow = new BrowserWindow({
    width: 1180,
    height: 760,
    minWidth: 980,
    minHeight: 640,
    backgroundColor: '#f4efe6',
    autoHideMenuBar: true, // Hides the default Electron menu bar
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    void mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    void mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url);
    return { action: 'deny' };
  });

  return mainWindow;
};

app.whenReady().then(() => {
  registerApiHandlers();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});