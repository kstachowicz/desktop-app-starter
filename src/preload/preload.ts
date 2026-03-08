// This file exposes the safe API surface to the renderer.
// Do not expose raw Electron objects here; only add narrowly scoped functions.

import { contextBridge, ipcRenderer } from 'electron';

import type { AppApi } from '../api';
import { apiMethods } from '../api';

const api = Object.fromEntries(
  apiMethods.map((methodName) => [
    methodName,
    () => ipcRenderer.invoke(methodName),
  ]),
) as AppApi;

contextBridge.exposeInMainWorld('api', api);