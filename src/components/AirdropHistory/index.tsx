import { useState, VFC } from 'react';

import { useTypedSelector } from 'store';

import { AirdropLine, AirdropStatus } from 'types';

import { CloseSVG, CompleteSVG, OpenSVG, WaitingSVG } from 'assets/img';

import s from './styles.module.scss';

interface IHistoryTable {
  complete: AirdropLine[];
  waiting: AirdropLine[];
  pending: AirdropLine[];
  onClose: () => void;
}

const getStatusIcon = (status: AirdropStatus) => {
  switch (status) {
    case 'confirmed': {
      return <CompleteSVG />;
    }
    case 'waiting': {
      return <WaitingSVG />;
    }
    default:
      return null;
  }
};

const HistoryTable: VFC<IHistoryTable> = ({ complete, waiting, pending, onClose }) => {
  return (
    <div className={s.historyTable}>
      <div className={s.historyTableContent}>
        <button className={s.close} type="button" onClick={onClose}>
          <CloseSVG />
        </button>
        <table className={s.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Tokens</th>
            </tr>
          </thead>
          <tbody>
            {pending.map((line) => {
              return (
                <tr key={line.idx} className={s.pending}>
                  <td>
                    {getStatusIcon('waiting')}{' '}
                    {new Date(+line.date * 1000).toLocaleDateString().replaceAll('/', '.')}
                  </td>
                  <td>{line.amount}</td>
                </tr>
              );
            })}
            {complete.map((line) => {
              return (
                <tr key={line.idx}>
                  <td>
                    {getStatusIcon('confirmed')}{' '}
                    {new Date(+line.date * 1000).toLocaleDateString().replaceAll('/', '.')}
                  </td>
                  <td>{line.amount}</td>
                </tr>
              );
            })}
            {waiting.map((line) => {
              return (
                <tr key={line.idx}>
                  <td>
                    {getStatusIcon('waiting')}{' '}
                    {new Date(+line.date * 1000).toLocaleDateString().replaceAll('/', '.')}
                  </td>
                  <td>{line.amount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AirdropHistory: VFC = () => {
  const [show, setShow] = useState(false);
  const { complete, freeze, pending } = useTypedSelector((state) => state.FreezeReducer);
  return (
    <div className={s.wrapper}>
      {freeze.length + complete.length + pending.length > 1 ? (
        <button type="button" onClick={() => setShow(!show)} className={s.date}>
          {new Date(+freeze[0].available_date * 1000)?.toLocaleDateString().replaceAll('/', '.')}{' '}
          <span className={`${s.arrow} ${show && s.rotate}`}>
            <OpenSVG />
          </span>
        </button>
      ) : (
        <span className={s.dateSingle}>
          {new Date(+freeze[0].available_date * 1000)?.toLocaleDateString().replaceAll('/', '.')}
        </span>
      )}
      {show && (
        <HistoryTable
          pending={pending.map((c, k) => ({
            idx: k,
            amount: c.amount,
            date: c.available_date,
          }))}
          complete={complete.map((c, k) => ({
            idx: k + pending.length,
            amount: c.amount,
            date: c.available_date,
          }))}
          waiting={freeze.map((c, k) => ({
            idx: k + complete.length + pending.length,
            amount: c.amount,
            date: c.available_date,
          }))}
          onClose={() => setShow(false)}
        />
      )}
    </div>
  );
};

export default AirdropHistory;
