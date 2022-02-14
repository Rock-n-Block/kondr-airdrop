import { useCallback, useEffect, useState, VFC } from 'react';

import { useTypedSelector } from 'store';

import { formatNumber } from 'utils/formatNumber';

import { CSVLine } from 'types';

import s from './styles.module.scss';

interface ITable {
  data: CSVLine[];
  baseData: CSVLine[];
  onDelete: (key: number) => void;
}

const countOnPage = 6;
const maxPagin = 8;

const calcTotal = (data: CSVLine[]) => {
  return data.map((line) => +line.amount).reduce((acc, val) => acc + val, 0);
};

const Table: VFC<ITable> = ({ data, baseData, onDelete }) => {
  const [mergedData, setMergedData] = useState([
    ...data.map((l) => ({ ...l, withButton: true })),
    ...baseData.map((l) => ({ ...l, withButton: false })),
  ]);
  const [currentPage, setCurrentPage] = useState(0);
  const [paginData, setPaginData] = useState(
    mergedData?.slice(currentPage, (currentPage + 1) * countOnPage),
  );

  const { balance } = useTypedSelector((state) => state.UserReducer);
  const [total, setTotal] = useState(calcTotal(data || []));

  useEffect(() => {
    if (data) {
      setTotal(calcTotal(data));
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      setMergedData([
        ...data.map((v) => ({ ...v, withButton: true })),
        ...baseData.map((l) => ({ ...l, withButton: false })),
      ]);
    }
  }, [data, baseData]);

  const onNextClick = useCallback(() => {
    if (mergedData) {
      if (currentPage + 1 < mergedData.length / countOnPage) {
        setCurrentPage(currentPage + 1);
      }
    }
  }, [currentPage, mergedData]);

  const onBtnClick = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const onPrevClick = useCallback(() => {
    if (currentPage - 1 >= 0) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  useEffect(() => {
    setPaginData(mergedData?.slice(currentPage * countOnPage, (currentPage + 1) * countOnPage));
  }, [currentPage, mergedData]);

  return (
    <div className={`${s.wrapper} ${s.tableWrap}`}>
      <table className={s.table}>
        <thead>
          <tr>
            <td>Address</td>
            <td>Date</td>
            <td>Amount</td>
            <td />
          </tr>
        </thead>
        <tbody>
          {paginData?.map((line) => (
            <tr key={line.idx}>
              <td className={s.address}>{line.address}</td>
              <td>{new Date(+line.data * 1000).toLocaleDateString()}</td>
              <td>{line.amount}</td>
              <td className={s.removeCell}>
                {line.withButton && (
                  <button className={s.remove} type="button" onClick={() => onDelete(line.idx)}>
                    remove
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={s.pagination}>
        <div className={s.paginator}>
          <button className={s.pagin} type="button" onClick={onPrevClick}>
            {' '}
            {'<'}{' '}
          </button>
          {mergedData &&
            Array(Math.ceil(mergedData.length / countOnPage))
              .fill(0)
              .map((page, key) => key)
              .splice(Math.floor(currentPage / (maxPagin - 1)) * (maxPagin - 1), maxPagin)
              .map((page) => (
                <button
                  className={`${s.pagin} ${page === currentPage && s.active}`}
                  type="button"
                  onClick={() => onBtnClick(page)}
                >
                  {page + 1}
                </button>
              ))}
          {}
          <button className={s.pagin} type="button" onClick={onNextClick}>
            {' '}
            {'>'}{' '}
          </button>
        </div>
        {balance && total > 0 && (
          <div className={s.bal}>
            <span className={`${s.balance} ${+balance < total && s.low}`}>
              Balance/Total {formatNumber(balance)}/{formatNumber(total.toString())}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;
