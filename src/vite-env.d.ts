/// <reference types="vite/client" />

// interface ViteTypeOptions {
//   // By adding this line, you can make the type of ImportMetaEnv strict
//   // to disallow unknown keys.
//   // strictImportMetaEnv: unknown
// }

interface ImportMetaEnv {
  readonly VITE_SYNC_SERVER_URL: string
  readonly VITE_SYNC_PULL_INTERVAL_MS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}