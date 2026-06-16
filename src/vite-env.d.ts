/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ENV: "dev" | "prod";
  readonly VITE_SITE_URL: string;
  readonly VITE_BACKEND_API_URL: string;
  readonly VITE_API_VERSION_PATH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
