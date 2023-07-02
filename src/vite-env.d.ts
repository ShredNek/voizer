/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_POSTMAN_KEY: string;
  // more env vars...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
