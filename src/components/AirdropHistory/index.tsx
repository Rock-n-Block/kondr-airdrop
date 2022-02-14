import { useState, VFC } from 'react';

import { AirdropLine, AirdropStatus } from 'types';

import { CloseSVG, CompleteSVG, WaitingSVG } from 'assets/img';

import s from './styles.module.scss';

interface IHistoryTable {
  data: AirdropLine[];
  onClose: () => void;
}

const getStatusIcon = (status: AirdropStatus) => {
  switch (status) {
    case 'complete': {
      return <CompleteSVG />;
    }
    case 'waiting': {
      return <WaitingSVG />;
    }
    default:
      return null;
  }
};

const HistoryTable: VFC<IHistoryTable> = ({ data, onClose }) => {
  return (
    <div className={s.historyTable}>
      <button className={s.close} type="button" onClick={onClose}>
        <CloseSVG />
      </button>
      <table>
        <thead>
          <td>Date</td>
          <td>Tokens</td>
        </thead>
        <tbody>
          {data.map((line) => {
            return (
              <tr key={line.idx}>
                <td>
                  {getStatusIcon(line.status)} {line.date}
                </td>
                <td>{line.amount}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const AirdropHistory: VFC = () => {
  const [show, setShow] = useState(false);
  const data: AirdropLine[] = [];

  return (
    <div>
      {data.length > 0 ? (
        <button type="button" onClick={() => setShow(!show)} className={s.date}>
          11.12.2022
        </button>
      ) : (
        <span>11.12.2022</span>
      )}
      {show && <HistoryTable data={data} onClose={() => setShow(false)} />}
    </div>
  );
};

export default AirdropHistory;
