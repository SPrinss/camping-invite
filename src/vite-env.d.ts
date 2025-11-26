/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_FIREBASE_EMULATOR: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
