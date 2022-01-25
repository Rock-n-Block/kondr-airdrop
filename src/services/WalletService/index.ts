import { ConnectWallet } from '@amfi/connect-wallet';
import { IConnect, IError, IEvent, IEventError } from '@amfi/connect-wallet/dist/interface';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

import { connectWalletConfig } from 'config';
import { bep20Abi, erc20Abi } from 'config/abi';
import { logger } from 'utils';

import { chainsEnum, IEventSubscriberCallbacks, TAvailableProviders } from 'types/connect/index';

type TokenAbiType = {
  [key in chainsEnum]: Array<AbiItem>;
};

const tokenAbis: TokenAbiType = {
  'Binance-Smart-Chain': bep20Abi as Array<AbiItem>,
  'Ethereum': erc20Abi as Array<AbiItem>,
};

class WalletService {
  private connectWallet;

  private currentChain: chainsEnum = chainsEnum.Ethereum;

  constructor() {
    this.connectWallet = new ConnectWallet();
  }

  public async initWalletConnect(
    chainName: chainsEnum,
    providerName: TAvailableProviders,
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const { provider, network, settings } = connectWalletConfig(chainName);

      const connection = this.connectWallet
        .connect(provider[providerName], network, settings)
        .then((connected: boolean | {}) => {
          if (connected) {
            this.currentChain = chainName;
            return connected;
          }
          throw new Error('connection error');
        })
        .catch((error: any) => {
          logger('connection error', error);
        });

      Promise.all([connection]).then((connect: any) => {
        resolve(connect[0]);
      });
    });
  }

  public logOut(): void {
    this.connectWallet.resetConect();
  }

  public Web3(): Web3 {
    return this.connectWallet.currentWeb3();
  }

  public getTokenBalance(address: string): Promise<string> {
    const contract = this.connectWallet.getContract({
      address,
      abi: tokenAbis[this.currentChain],
    });

    return contract.methods.decimals.call();
  }

  public getAccount(address: string): Promise<IConnect | IError | { address: string }> {
    return new Promise((resolve: any, reject: any) => {
      this.connectWallet.getAccounts().then(
        async (userAccount: any) => {
          if (userAccount.address !== address) {
            resolve(userAccount);
          }
        },
        (err: any) => {
          if (err.code && err.code === 6) {
            logger('Disconnect');
          } else {
            logger('Getting account error', err, 'error');
            reject(err);
          }
        },
      );
    });
  }

  public getBalance(address: string): Promise<string | number> {
    return this.connectWallet.getBalance(address);
  }

  public getCurrentChain(){
     return this.currentChain;
  }

  public eventSubscribe(callbacks?: IEventSubscriberCallbacks): void {
    this.connectWallet.eventSubscriber().subscribe(
      (data: IEvent) => {
        const successCallbacks = callbacks?.success;
        successCallbacks?.forEach((callback) => {
          if (callback[data.name]) {
            callback[data.name](data);
          }
        });
      },
      (error: IEventError) => {
        const successCallbacks = callbacks?.error;
        successCallbacks?.forEach((callback) => {
          if (callback[error.code]) {
            callback[error.code](error);
          }
        });
        this.eventSubscribe(callbacks);
      },
    );
  }
}
const WalletServiceInstance = new WalletService();
export type TWalletService = typeof WalletServiceInstance;

export default WalletServiceInstance;
