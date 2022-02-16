import { useCallback, useEffect, useMemo, useState, VFC } from 'react';

import { useTypedDispatch, useTypedSelector } from 'store';
import { FreezeSlice } from 'store/reducers/freeze';
import { StateSlice } from 'store/reducers/state';

import { Button, Timer } from 'components';
import { logger } from 'utils';

import { useContractContext } from 'services/ContractContext';

import { Connection } from '..';

import s from '../styles.module.scss';

const Collect: VFC = () => {
  const { freeze, isLoading } = useTypedSelector((state) => state.FreezeReducer);
  const { claimTokens } = useContractContext();
  const dispatch = useTypedDispatch();
  const { setState } = StateSlice.actions;
  const { setCollect } = FreezeSlice.actions;
  const collectData = useMemo(() => {
    const minimal = [...freeze].sort((f, sec) => +f.available_date - +sec.available_date)[0];
    logger(
      'collect data',
      freeze.filter((f) => f.available_date === minimal.available_date),
    );
    return freeze.filter((f) => f.available_date === minimal.available_date);
  }, [freeze]);

  useEffect(() => {
    if (+collectData[0].available_date - Date.now() / 1000 <= 0) {
      dispatch(setState(2));
    } else {
      dispatch(setState(1));
    }
  }, [collectData, dispatch, setState]);

  useEffect(() => {
    dispatch(setCollect(collectData[0].amount));
  }, [collectData, dispatch, setCollect]);

  const onClaimClick = useCallback(() => {
    logger('collect data', {
      amount: collectData[0].amount,
      signature: collectData[0].signature,
    });
    claimTokens(collectData[0].amount, collectData[0].available_date, collectData[0].signature);
  }, [claimTokens, collectData]);

  const [seconds, setSeconds] = useState(
    +collectData[0].available_date - Date.now() / 1000 > 0
      ? +collectData[0].available_date - Date.now() / 1000 + 30
      : 0,
  );

  useEffect(() => {
    setSeconds(
      +collectData[0].available_date - Date.now() / 1000 > 0
        ? +collectData[0].available_date - Date.now() / 1000
        : 0,
    );
  }, [collectData]);

  useEffect(() => {
    if(seconds === 0){
      dispatch(setState(2));
    }
  }, [dispatch, seconds, setState])

  return (
    <div className={s.wrapper}>
      <Timer seconds={seconds} setSeconds={setSeconds} amount={collectData[0].amount} />
      <div className={s.btns}>
        <Connection />
        <Button
          id="claim"
          name="Claim Token"
          onClick={onClaimClick}
          theme={seconds !== 0 ? 'white' : 'purple'}
          disabled={seconds !== 0}
          isLoading={isLoading}
          className={s.claim}
        />
      </div>
    </div>
  );
};

export default Collect;
