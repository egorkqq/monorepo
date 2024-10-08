/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ARCHITECTON_API_FQDN: string;
  readonly VITE_TESTNET_NODE_1: string;
  readonly VITE_TESTNET_NODE_2: string;
  readonly VITE_MAINNET_NODE_1: string;
  readonly VITE_MAINNET_NODE_2: string;
  // old
  readonly VITE_MANIFEST_URL: string;
  readonly VITE_APP_URL: string;
  readonly VITE_BE_URL: string;
  readonly VITE_P2P_BE_URL: string;
  readonly VITE_TA_URL: string;
  readonly VITE_TONAPI_KEY: string;
  readonly VITE_GA_ID: string;
  readonly VITE_BANK_JETTON_MASTER_ADDRESS: string;
  readonly VITE_BANK_CROWDSALE_ADDRESS: string;
  readonly VITE_BANK_GAS_AMOUNT: string;
  readonly VITE_TON_CLIENT_NETWORK: string;
  readonly VITE_TON_PINCODE_SALT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
