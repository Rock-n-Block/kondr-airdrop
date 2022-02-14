import { chainsEnum, IChain, IConnectWallet, IContracts } from 'types';

import { airdropAbi, tokenAbi } from './abi';

export const is_production = false;

export const chains: IChain = {
  [chainsEnum.Ethereum]: {
    name: chainsEnum.Ethereum,
    network: {
      chainID: is_production ? 1 : 4,
      chainName: is_production ? 'Ethereum Mainnet' : 'Rinkeby Testnet',
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      rpc: is_production
        ? 'https://mainnet.infura.io/v3/2d76b686b0484e9ebecbaddd23cd37c7'
        : 'https://rinkeby.infura.io/v3/2d76b686b0484e9ebecbaddd23cd37c7',
      blockExplorerUrl: is_production ? 'https://etherscan.io/' : 'https://rinkeby.etherscan.io/',
    },
    provider: {
      MetaMask: { name: 'MetaMask' },
    },
    explorer: is_production ? 'https://etherscan.io/' : 'https://rinkeby.etherscan.io/',
  },
  [chainsEnum['Binance-Smart-Chain']]: {
    name: chainsEnum['Binance-Smart-Chain'],
    network: {
      chainID: is_production ? 56 : 97,
      chainName: is_production ? 'Binance Smart Chain' : 'Binance Smart Chain Testnet',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
      },
      rpc: is_production
        ? 'https://bsc-dataseed.binance.org/'
        : 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      blockExplorerUrl: is_production ? 'https://bscscan.com' : 'https://testnet.bscscan.com',
    },
    provider: {
      MetaMask: { name: 'MetaMask' },
    },
    explorer: is_production ? 'https://bscscan.com' : 'https://testnet.bscscan.com',
  },
};

/**
 *
 * @param {chainsEnum} chainName - name of the chain name
 * @returns config for connection wallet which includes
 * * wallets
 * * network
 * * provider
 * * settings
 */
export const connectWalletConfig = (chainName: chainsEnum): IConnectWallet => {
  const chain = chains[chainName];

  return {
    wallets: ['MetaMask'],
    network: chain.network,
    provider: chain.provider,
    settings: { providerType: true },
  };
};

export const contracts: IContracts = {
  type: is_production ? 'mainnet' : 'testnet',
  names: ['AIRDROP', 'TOKEN'],
  params: {
    AIRDROP: {
      mainnet: {
        address: '0xE59004C4D160BF33acEe81DAdb00E1Db95DaF836',
        abi: airdropAbi,
      },
      testnet: {
        address: '0xE59004C4D160BF33acEe81DAdb00E1Db95DaF836',
        abi: airdropAbi,
      },
    },
    TOKEN: {
      mainnet: {
        address: '0x5A520e593F89c908cd2bc27D928bc75913C55C42',
        abi: tokenAbi,
      },
      testnet: {
        address: '0xF8A950d09509654d398faBE1C4A6870Bbf780eCc',
        abi: tokenAbi,
      },
    },
  },
};
