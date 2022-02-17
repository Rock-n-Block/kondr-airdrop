import { Utils } from "web3-utils";

export interface IContractContext {
  approveFreeze: (tokens: string[], onSuccess: () => void) => Promise<void>;
  claimTokens: (amount: string, timestamp: string, signature: string) => Promise<void>;
  getBalance: () => Promise<string>;
  getOwner: any;
  getActualBalanceOf: (addr: string) => Promise<string>;
  web3utils: Utils;
}
