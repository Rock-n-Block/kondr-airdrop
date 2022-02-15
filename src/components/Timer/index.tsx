import { useEffect, VFC } from 'react';

import { AirdropHistory } from 'components';

import s from './styles.module.scss';

interface ITimer {
  seconds: number;
  setSeconds: (args: any) => void;
  amount: string;
}

const singleDay = 86400;

const generateTime = (seconds: number) => {
  if (seconds <= singleDay) {
    let sec = seconds;
    const h = Math.floor(sec / 3600);
    sec -= h * 3600;
    const m = Math.floor(sec / 60);
    sec -= m * 60;
    sec = Math.floor(sec);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec
      .toString()
      .padStart(2, '0')}`;
  }
  return `${Math.round(seconds / singleDay)}`;
};

const Timer: VFC<ITimer> = ({ seconds, setSeconds, amount }) => {
  useEffect(() => {
    // eslint-disable-next-line no-confusing-arrow
    const t = setInterval(() => setSeconds((prev: number) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => {
      clearInterval(t);
    };
  }, [setSeconds]);

  return (
    <div className={s.wrapper}>
      {seconds > 0 && (
        <div className={s.next}>
          NEXT RELEASE OF {amount} WILL BE IN: <AirdropHistory />
        </div>
      )}
      <span className={s.timer}>
        {generateTime(seconds)}
        {seconds >= singleDay ? (
          <span className={s.minuts}>{seconds / singleDay >= 2 ? 'days' : 'day'}</span>
        ) : (
          <>
            <span className={s.hours}>hours</span>
            <span className={s.minuts}>minuts</span>
            <span className={s.seconds}>second</span>
          </>
        )}
      </span>
    </div>
  );
};

export default Timer;
