import { createContext, FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useTypedDispatch, useTypedSelector } from 'store';
import { FileSlice } from 'store/reducers/files';
import { FreezeSlice } from 'store/reducers/freeze';
import { StateSlice } from 'store/reducers/state';
import { UserSlice } from 'store/reducers/user';

import { contracts } from 'config';
import { deNormalizedValue, logger, normalizedValue } from 'utils';

import ContractService from 'services/ContractService';
import { useModals } from 'services/ModalsContext';
import { IContractContext } from 'types';

const ContractContext = createContext<IContractContext>({} as IContractContext);

const cService = ContractService;

const Contract: FC = ({ children }) => {
  const dispatch = useTypedDispatch();

  const { openModal, closeAll } = useModals();

  const { address } = useTypedSelector((state) => state.UserReducer);
  const { setFile, setFiles } = FileSlice.actions;
  const { setFreeze } = FreezeSlice.actions;
  const { setBalance, setIsOwner } = UserSlice.actions;
  const { setState } = StateSlice.actions;
  const [tokenContract, setTokenContract] = useState(
    cService.getContract(
      contracts.params.TOKEN[contracts.type].abi,
      contracts.params.TOKEN[contracts.type].address,
    ),
  );

  const [airContract, setAirContract] = useState(
    cService.getContract(
      contracts.params.AIRDROP[contracts.type].abi,
      contracts.params.AIRDROP[contracts.type].address,
    ),
  );

  useEffect(() => {
    setTokenContract(
      cService.getContract(
        contracts.params.TOKEN[contracts.type].abi,
        contracts.params.TOKEN[contracts.type].address,
      ),
    );
    setAirContract(
      cService.getContract(
        contracts.params.AIRDROP[contracts.type].abi,
        contracts.params.AIRDROP[contracts.type].address,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cService.Web3]);

  const getOwner = useCallback(
    async (addr: string) => {
      const owner: string = await tokenContract.methods.owner().call();
      dispatch(setIsOwner(addr.toLowerCase() === owner.toLowerCase()));
      return addr.toLowerCase() === owner.toLowerCase();
    },
    [dispatch, setIsOwner, tokenContract.methods],
  );

  const getBalance = useCallback(async () => {
    const balance: string = await tokenContract.methods
      .balanceOf(address)
      .call()
      .then((val: string) => normalizedValue(val));
    dispatch(setBalance(balance));
    return balance;
  }, [address, dispatch, setBalance, tokenContract.methods]);

  const approveFreeze = useCallback(
    async (addresses: string[], tokens: string[], freezeTime: string[]) => {
      const amount = tokens.map((val) => +val).reduce((acc, val) => acc + val, 0);
      const checkAllowance = async function () {
        const allowanced = await tokenContract.methods
          .allowance(address, contracts.params.AIRDROP[contracts.type].address)
          .call((allow: string) => normalizedValue(allow));
        logger('is allowance more than amount', +allowanced >= amount);
        if (+allowanced >= +deNormalizedValue(amount)) {
          const normAddresses = addresses;
          const normTokens = tokens.map((token: string) => deNormalizedValue(token));
          const normFreeze = freezeTime;
          const res = await airContract.methods
            .multiFreezeToken(
              contracts.params.TOKEN[contracts.type].address,
              normAddresses,
              normTokens,
              normFreeze,
              deNormalizedValue(amount),
            )
            .send({ from: address });
          if (Object.keys(res.events).length > 0) {
            openModal({
              type: 'success',
              title: `Your tokens have been successfully distributed`,
              onClick: closeAll,
            });
            dispatch(setState(1));
            dispatch(setFile(null));
            dispatch(setFiles([]));
          }
        } else {
          const approved = await tokenContract.methods
            .approve(contracts.params.AIRDROP[contracts.type].address, deNormalizedValue(amount))
            .send({ from: address });
          if (approved) {
            checkAllowance();
          }
        }
      };
      await checkAllowance();
    },
    [
      address,
      airContract.methods,
      closeAll,
      dispatch,
      openModal,
      setFile,
      setFiles,
      setState,
      tokenContract.methods,
    ],
  );

  const getFreezeTokens = useCallback(
    async (addr: string) => {
      const count = await tokenContract.methods
        .freezingCount(addr)
        .call()
        .then((val: string) => +val);
      if (+count > 0) {
        const getFreezeById = async function (id: number) {
          const freezeElement = await tokenContract.methods.getFreezing(addr, id).call();
          dispatch(
            setFreeze({
              balance: normalizedValue(freezeElement[1]).toString(),
              release: +freezeElement[0] - Date.now() / 1000,
            }),
          );
        };
        for (let i = 0; i < count; i += 1) {
          getFreezeById(i);
        }
      }
      return count;
    },
    [dispatch, setFreeze, tokenContract.methods],
  );

  const claimTokens = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (amount: string) => {
      const res = await tokenContract.methods.releaseAll().send({ from: address });
      if ('Released' in res.events) {
        openModal({
          type: 'success',
          title: `Great! You successfully received your tokens.`,
          onClick: closeAll,
        });
      }
      dispatch(setState(1));
    },
    [address, closeAll, dispatch, openModal, setState, tokenContract.methods],
  );

  const ContractValues = useMemo(
    () => ({
      claimTokens,
      getFreezeTokens,
      approveFreeze,
      getBalance,
      getOwner,
      web3utils: cService.getWeb3utils(),
    }),
    [approveFreeze, claimTokens, getBalance, getFreezeTokens, getOwner],
  );

  return <ContractContext.Provider value={ContractValues}>{children}</ContractContext.Provider>;
};

export const useContractContext = () => {
  return useContext(ContractContext);
};

export default Contract;
