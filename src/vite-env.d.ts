/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_EMAIL_ENDPOINT: string;
  // more env vars...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
