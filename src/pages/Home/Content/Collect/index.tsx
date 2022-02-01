import { useCallback, useEffect, useMemo, useState, VFC } from 'react';

import { useTypedDispatch, useTypedSelector } from 'store';
import { FreezeSlice } from 'store/reducers/freeze';
import { StateSlice } from 'store/reducers/state';

import { Button, Timer } from 'components';

import { useContractContext } from 'services/ContractContext';

import { Connection } from '..';

import s from '../styles.module.scss';
import { logger } from 'utils';

const Collect: VFC = () => {
  const { freeze } = useTypedSelector((state) => state.FreezeReducer);
  const { claimTokens } = useContractContext();
  const dispatch = useTypedDispatch();
  const { setState } = StateSlice.actions;
  const { setCollect } = FreezeSlice.actions;
  const collectData = useMemo(() => {
    const result = { balance: 0, release: 0 };
    const minimal = [...freeze].sort((f, sec) => f.release - sec.release);
    const prev = freeze.filter((val) => val.release < 0);
    result.balance = prev.reduce((acc, val) => acc + +val.balance, 0);
    if (minimal.length > 0 && minimal[0].release > 0 && prev.length !== 0) {
      return result;
    }
    if (minimal.length > 0 && minimal[0].release > 0 && prev.length === 0) {
      return minimal[0];
    }
    logger('collect Data', collectData);
    return result;
  }, [freeze]);

  useEffect(() => {
    if (collectData.release <= 0) {
      dispatch(setState(2));
    }
  }, [collectData.release, dispatch, setState]);

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
      <Timer seconds={seconds} setSeconds={setSeconds} amount={collectData.balance.toString()} />
      <div className={s.btns}>
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
    </div>
  );
};

export default Collect;
