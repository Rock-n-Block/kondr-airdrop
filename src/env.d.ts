interface ImportMetaEnv {
  readonly NODE_ENV: 'development' | 'production' | 'test';
  readonly PUBLIC_URL: string;
  readonly VITE_API_URL: string;
  readonly VITE_CHAIN_ID: number;
  readonly VITE_CHAIN_NAME: string;
  readonly VITE_BLOCK_EXPLORER_URL: string;
  readonly VITE_RPC: string;
  readonly VITE_EXPLORER: string;
  readonly VITE_CONTRACT: 'mainnet' | 'testnet';
  readonly VITE_PROJECT_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
