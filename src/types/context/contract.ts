import { Utils } from "web3-utils";

export interface IContractContext {
  approveFreeze: (addresses: string[], tokens: string[], freezeTime: string[]) => Promise<void>;
  claimTokens: (amount: string, timestamp: string, signature: string) => Promise<void>;
  getBalance: () => Promise<string>;
  getOwner: any;
  getActualBalanceOf: (addr: string) => Promise<string>;
  web3utils: Utils;
}
