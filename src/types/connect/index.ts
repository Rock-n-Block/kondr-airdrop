import { IEvent, IEventError, INetwork, IProvider, ISettings } from '@amfi/connect-wallet/dist/interface';

export enum chainsEnum {
  'Binance-Smart-Chain' = 'Binance-Smart-Chain',
  Ethereum = 'Ethereum',
}

const AvailableProviders = ['MetaMask'] as const;
export type TAvailableProviders = typeof AvailableProviders[number];

export interface IConnectWallet {
  wallets: TAvailableProviders[];
  network: INetwork;
  provider: {
    [index: string]: IProvider;
  };
  settings: ISettings;
}

export interface IChain {
  [key: string]: {
    name: chainsEnum;
    network: INetwork;
    provider: {
      [key: string]: any;
    };
    explorer: string;
  };
}

export interface IChainConfig {
  name: string;
  id: number;
  rpc: string;
  tx: {
    link: string;
  };
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExp: string;
}

export interface IContracts {
  names: string[];
  type: 'mainnet' | 'testnet';
  params: {
    [index: string]: {
      mainnet: {
        address: string;
        abi: any[];
      };
      testnet: {
        address: string;
        abi: any[];
      };
    };
  };
}

interface ISuccessEvent {
  [key: string]: (event: IEvent) => void;
}

interface IErrorEvent {
  [key: number]: (event: IEventError) => void;
}

export interface IEventSubscriberCallbacks {
  success?: ISuccessEvent[];
  error?: IErrorEvent[];
}
