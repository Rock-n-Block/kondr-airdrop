import { useCallback, useEffect, useMemo, useState, VFC } from 'react';

import { useTypedDispatch, useTypedSelector } from 'store';

import { Button, Timer } from 'components';

import { useContractContext } from 'services/ContractContext';

import { Connection } from '..';

import s from '../styles.module.scss';
import { StateSlice } from 'store/reducers/state';
import { FreezeSlice } from 'store/reducers/freeze';

const Collect: VFC = () => {
  const { freeze } = useTypedSelector((state) => state.FreezeReducer);
  const { claimTokens } = useContractContext();
  const dispatch = useTypedDispatch();
  const {setState} = StateSlice.actions;
  const {setCollect} = FreezeSlice.actions;
  const collectData = useMemo(() => {
    const result = { balance: 0, release: 0 };
    const minimal = freeze.sort((f,sec) => f.release - sec.release)[0];
    const prev = freeze.filter((val) => val.release < 0);
    result.balance = prev.reduce((acc, val) => acc + +val.balance, 0);
    if (minimal.release > 0 && prev.length !== 0) {
      return result;
    }
    if (minimal.release > 0 && prev.length === 0) {
      return minimal;
    }
    return result;
  }, [freeze]);

  useEffect(() => {
    if (collectData.release <= 0) {
      dispatch(setState(2));
    }
  }, [collectData.release, dispatch, setState])

  useEffect(() => {
    dispatch(setCollect(collectData.balance.toString()));
  }, [collectData.balance, dispatch, setCollect]);

  const onClaimClick = useCallback(() => {
    claimTokens(collectData.balance.toString());
  }, [claimTokens, collectData.balance]);

  const [seconds, setSeconds] = useState(collectData.release);

  useEffect(() => {
    setSeconds(collectData.release);
  }, [collectData.release]);

  return (
    <div className={s.wrapper}>
      <Timer seconds={seconds} setSeconds={setSeconds}/>
      <Connection />
      <Button
        id="claim"
        name="Claim Token"
        onClick={onClaimClick}
        theme={seconds !== 0 ? 'white' : 'purple'}
        disabled={seconds !== 0}
        className={s.claim}
      />
    </div>
  );
};

export default Collect;
