import { FC } from 'react';

import { useTypedSelector } from 'store';

import { Collect, Connection, LoadCSV } from './Content';

import s from './Home.module.scss';

const getTitle = (isOwner: boolean, step: number) => {
  if (isOwner) {
    switch (step) {
      case 1: {
        return () => 'PLEASE UPLOAD THE LIST OF VESTED WALLETS';
      }
      case 2: {
        return () => `PROCEED WITH THE CURRENT FILE`;
      }
      case 3: {
        return () => `LIST OF VESTED WALLETS`;
      }
      default:
        return () => 'PLEASE CONNECT YOUR WALLET TO VIEW YOUR VESTING SCHEDULE';
    }
  } else {
    switch (step) {
      case 1: {
        return (name: string, amount: string) => `YOUR CURRENT AMOUNT OF ${name} TOKENS IS ${amount}`;
      }
      case 2: {
        return (name: string, amount: string) => `CLAIM ${amount} ${name} TOKENS`;
      }
      default:
        return () => 'PLEASE CONNECT YOUR WALLET TO VIEW YOUR VESTING SCHEDULE';
    }
  }
};

const getContent = (isOwner: boolean, step: number) => {
  if (isOwner) {
    switch (step) {
      case 1:
      case 2:
      case 3: {
        return <LoadCSV />;
      }
      default:
        return <Connection />;
    }
  } else {
    switch (step) {
      case 1:
      case 2: {
        return <Collect />;
      }
      default:
        return <Connection />;
    }
  }
};

const Home: FC = () => {
  const { state } = useTypedSelector((st) => st.StateReducer);
  const { isOwner, balance } = useTypedSelector((st) => st.UserReducer);
  const { collect } = useTypedSelector((st) => st.FreezeReducer);

  return (
    <div className={s.home_wrapper}>
      <h1 className={s.title}>
        {getTitle(isOwner, state)('KON', state === 1 ? Number(balance).toFixed(2) : collect)}
      </h1>
      {getContent(isOwner, state)}
    </div>
  );
};
export default Home;
