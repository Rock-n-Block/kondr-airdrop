/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, FC, useCallback, useContext, useEffect, useMemo, useRef } from 'react';

import { useTypedDispatch, useTypedSelector } from 'store';
import { FreezeSlice } from 'store/reducers/freeze';
import { StateSlice } from 'store/reducers/state';
import { UserSlice } from 'store/reducers/user';

import { logger, normalizedValue } from 'utils';

import useLocalStorage from 'hooks/useLocalStorage';
import { userApi } from 'services/api';
import { useContractContext } from 'services/ContractContext';
import ContractService from 'services/ContractService';
import { useModals } from 'services/ModalsContext';
import WalletService, { TWalletService } from 'services/WalletService';
import { chainsEnum, IEventSubscriberCallbacks, IWalletContext, TAvailableProviders } from 'types';

declare global {
  interface Window {
    ethereum: any;
  }
}

const WalletConnectContext = createContext<IWalletContext>({} as IWalletContext);

const Connect: FC = ({ children }) => {
  const dispatch = useTypedDispatch();
  const { setAddress, setBalance, setIsLoading, setIsOwner } = UserSlice.actions;
  const { address } = useTypedSelector((state) => state.UserReducer);
  const { setState } = StateSlice.actions;
  const { setBaseFreeze, setFreeze, setComplete } = FreezeSlice.actions;
  const { openModal, closeAll } = useModals();

  const { getOwner, getActualBalanceOf } = useContractContext();

  const provider = useRef<TWalletService>(WalletService);
  const [localProviderName, setLocalProviderName] = useLocalStorage(
    `${import.meta.env.VITE_PROJECT_NAME}-provider`,
    '',
  );

  const disconnect = useCallback(() => {
    setLocalProviderName('');
    localStorage.removeItem('kondr_token');
    dispatch(setAddress(''));
    dispatch(setBalance('0'));
    dispatch(setIsOwner(false));
    dispatch(setState(0));
  }, [dispatch]);

  const getUserData = useCallback(
    async (providerName: string) => {
      dispatch(setState(0));
      const res = await provider.current.getAccount(address || '');
      if ('address' in res) {
        let baseFreeze;
        const isOwn = await getOwner(res.address);
        if (!localStorage.getItem('kondr_token') && isOwn) {
          const msg = await userApi.getMsg();
          const signedMsg = await provider.current.signMsg(res.address, msg.data);
          logger('login', {
            address: res.address,
            msg: msg.data,
            signedMsg,
          });
          const login: any = await userApi.login({
            address: res.address,
            msg: msg.data,
            signedMsg,
          });
          if (login.data.key) {
            localStorage.setItem('kondr_token', login.data.key);
          }
        }
        if (isOwn) {
          baseFreeze = await userApi.getData();
          dispatch(
            setBaseFreeze(
              baseFreeze.data.map((d: any) => ({
                address: d.address,
                amount: d.amount,
                data: d.available_date,
              })),
            ),
          );
        }
        const balance = isOwn
          ? await provider.current.getBalance(res.address)
          : await getActualBalanceOf(res.address).then((r: any) => normalizedValue(r));
        dispatch(setAddress(res.address));
        dispatch(setBalance(balance.toString()));
        setLocalProviderName(providerName);
        const userFreeze = await userApi.getData(res.address, 'waiting');
        const userCompelete = await userApi.getData(res.address, 'confirmed');
        dispatch(setFreeze(userFreeze.data));
        dispatch(setComplete(userCompelete.data));
        if (!isOwn && userFreeze.data.length === 0) {
          openModal({
            type: 'error',
            title: `Sorry but your address is not eligible for the airdrop. Please try using another address!`,
            onClick: closeAll,
          });
          disconnect();
        } else if (baseFreeze?.data.length > 0) {
          dispatch(setState(3));
        } else {
          dispatch(setState(1));
        }
      }
    },
    [address],
  );

  const connect = useCallback(
    async (chainName: chainsEnum, providerName: TAvailableProviders) => {
      dispatch(setIsLoading(true));
      if (window.ethereum) {
        try {
          const connected = await provider.current.initWalletConnect(chainName, providerName);
          if (connected) {
            try {
              ContractService.resetWeb3(WalletService.Web3());
              await getUserData(providerName);
              const callbacks: IEventSubscriberCallbacks = {
                success: [{ accountsChanged: () => getUserData(providerName) }],
              };
              provider.current.eventSubscribe(callbacks);
            } catch (err: any) {
              logger('Getting address or balance error', err, 'error');
            }
          }
        } catch (err: any) {
          logger('Ethereum', err, 'error');
        }
      }
      dispatch(setIsLoading(false));
    },
    [dispatch, getUserData],
  );

  const WalletConnectValues = useMemo(
    () => ({
      connect,
      disconnect,
      walletService: provider.current,
    }),
    [connect, disconnect],
  );

  const firstConnection = useCallback(async () => {
    if (window.ethereum && localProviderName) {
      await connect(provider.current.getCurrentChain(), localProviderName as TAvailableProviders);
    }
  }, []);

  useEffect(() => {
    firstConnection();
  }, []);

  return (
    <WalletConnectContext.Provider value={WalletConnectValues}>
      {children};
    </WalletConnectContext.Provider>
  );
};

export default Connect;

export const useWalletConnectorContext = () => {
  return useContext(WalletConnectContext);
};
