// This file is the extension point for new renderer-facing backend actions.
// To add a new endpoint: write the function, then register one line in apiHandlers.

import type { ApiMethodName, ApiResponseMap } from '../api';
import { getHelloMessage } from './database';

type HandlerMap = {
  [Key in ApiMethodName]: () => ApiResponseMap[Key] | Promise<ApiResponseMap[Key]>;
};

export const apiHandlers: HandlerMap = {
  getHelloMessage,
};