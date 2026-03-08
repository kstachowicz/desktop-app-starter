import type { AppApi } from '../api';

declare global {
  interface Window {
    api: AppApi;
  }
}

export {};