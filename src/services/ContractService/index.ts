import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

import { connectWalletConfig } from 'config';

import { chainsEnum } from 'types';

class ContractService {
  public Web3;

  public utils;

  constructor() {
    this.Web3 = new Web3(connectWalletConfig(chainsEnum.Ethereum).network.rpc!);
    this.utils = this.Web3.utils;
  }

  public getContract(abi: AbiItem | AbiItem[], address: string) {
    return new this.Web3.eth.Contract(abi, address);
  }

  public getWeb3utils() {
    return this.utils;
  }

  public resetWeb3(newWeb3: Web3) {
    this.Web3 = newWeb3;
  }
}

export default new ContractService();
