// Shared API contract used by both the main process and the renderer bridge.
// Add new method names here when you want a new capability exposed to the UI.

export const apiMethods = ['getHelloMessage'] as const;

export type ApiMethodName = (typeof apiMethods)[number];

export type HelloMessage = {
  text: string;
  source: 'sqlite';
};

export type ApiResponseMap = {
  getHelloMessage: HelloMessage;
};

export type AppApi = {
  [Key in ApiMethodName]: () => Promise<ApiResponseMap[Key]>;
};