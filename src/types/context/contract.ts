import { Utils } from "web3-utils";

export interface IContractContext {
  approveFreeze: (addresses: string[], tokens: string[], freezeTime: string[]) => Promise<void>;
  claimTokens: (amount: string) => Promise<void>;
  getBalance: () => Promise<string>;
  getOwner: any;
  getFreezeTokens: (addr: string) => Promise<any>;
  web3utils: Utils;
}
