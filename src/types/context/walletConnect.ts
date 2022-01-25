import { chainsEnum, TAvailableProviders } from 'types/connect/index';

import { TWalletService } from 'services/WalletService';

export interface IWalletContext {
  connect: (chainName: chainsEnum, providerName: TAvailableProviders) => void;
  disconnect: () => void;
  walletService: TWalletService;
}
