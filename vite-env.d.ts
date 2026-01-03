// @ts-ignore
/// <reference types="vite/client" />

/**
 * Declaring NodeJS namespace to support process.env.API_KEY injected via vite.config.ts
 */
declare namespace NodeJS {
  interface ProcessEnv {
    readonly API_KEY: string;
    [key: string]: string | undefined;
  }
}

interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
