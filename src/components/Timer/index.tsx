import { useEffect, VFC } from 'react';

import s from './styles.module.scss';

interface ITimer {
  seconds: number;
  setSeconds: (args: any) => void;
}

const generateTime = (seconds: number) => {
  return new Date(seconds * 1000).toISOString().substr(11, 8);
};

const Timer: VFC<ITimer> = ({ seconds, setSeconds }) => {

  useEffect(() => {
    // eslint-disable-next-line no-confusing-arrow
    const t = setInterval(() => setSeconds((prev: number) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => {
      clearInterval(t);
    };
  }, [setSeconds]);

  return (
    <div className={s.wrapper}>
      <span className={s.timer}>
        {generateTime(seconds)}
        <span className={s.hours}>hours</span>
        <span className={s.minuts}>minuts</span>
        <span className={s.seconds}>seconds</span>
      </span>
    </div>
  );
};

export default Timer;
