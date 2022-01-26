import { FormEvent, useCallback, useState, VFC } from 'react';

import { useTypedDispatch, useTypedSelector } from 'store';
import { FileSlice } from 'store/reducers/files';
import { StateSlice } from 'store/reducers/state';

import { Button, Table } from 'components';
import { logger } from 'utils';

import { useContractContext } from 'services/ContractContext';
import { useModals } from 'services/ModalsContext';
import { CSVLine } from 'types';

import s from '../styles.module.scss';

const calcTotal = (data: CSVLine[]) => {
  return data.map((line) => +line.amount).reduce((acc, val) => acc + val, 0);
};

const LoadCSV: VFC = () => {
  const dispatch = useTypedDispatch();
  const { setFiles, setFile, setIsLoading, setError } = FileSlice.actions;
  const { files, file, isLoading } = useTypedSelector((state) => state.FileReducer);
  const { approveFreeze, getBalance, web3utils } = useContractContext();
  const { openModal, closeAll } = useModals();
  const { balance } = useTypedSelector((state) => state.UserReducer);
  const { state } = useTypedSelector((st) => st.StateReducer);
  const { setState } = StateSlice.actions;
  const [loadingFreeze, setLoadingFreeze] = useState(false);

  const ReadFile = useCallback(async () => {
    dispatch(setError([]));
    const err: string[] = [];
    if (file) {
      dispatch(setIsLoading(true));
      const fileReader = new FileReader();
      fileReader.onload = async function () {
        await getBalance().then((bal) => {
          const readResult = fileReader.result as string;
          const lines = readResult.split('\n');
          const CSVData: CSVLine[] = [];
          lines.forEach((line, key) => {
            if (line.length > 0) {
              const [address, data, amount] = line.replaceAll('"', '').split(',');
              if (!web3utils.checkAddressChecksum(address)) {
                err.push(`error address at line ${key + 1}`);
                return;
              }
              const [month, day, year] = data.replaceAll('/', '.').replaceAll(',', '.').split('.');
              if (
                new Date(+year, +month, +day).getTime() < Date.now() ||
                Number.isNaN(new Date(+year, +month, +day)) ||
                !day ||
                !month ||
                !year
              ) {
                err.push(`error date at line ${key + 1}`);
                return;
              }
              if (Number.isNaN(parseFloat(amount))) {
                err.push(`error amount at line ${key + 1}`);
                return;
              }
              const idx = CSVData.findIndex(
                (value) => value.address === address && value.data === data,
              );
              if (idx === -1) {
                CSVData.push({ address, data, amount, idx: key });
              } else {
                CSVData[idx] = {
                  ...CSVData[idx],
                  amount: (+amount + +CSVData[idx].amount).toString(),
                };
              }
            }
          });
          const amount = CSVData.map((line) => +line.amount).reduce((acc, val) => acc + val, 0);
          if (amount >= +bal) {
            openModal({
              type: 'error',
              title: `You don't have enough currency, please edit the table`,
              onClick: closeAll,
            });
          }
          logger('errors', err);
          logger(
            'table',
            CSVData.map((val) => `${val.address} ${val.data} ${val.amount}\n`),
          );
          if (CSVData.length > 0) {
            dispatch(setState(3));
          } else {
            openModal({
              type: 'error',
              title: `Uploaded file is incorrect. Please make sure it corresponds with the Sample file.`,
              onClick: closeAll,
            });
          }
          dispatch(setError(err));
          dispatch(setFiles(CSVData));
          dispatch(setIsLoading(false));
        });
      };
      fileReader.readAsText(file);
      return true;
    }
    return false;
  }, [
    closeAll,
    dispatch,
    file,
    getBalance,
    openModal,
    setError,
    setFiles,
    setIsLoading,
    setState,
    web3utils,
  ]);

  const onFileLoad = useCallback(
    async (e: FormEvent<HTMLInputElement>) => {
      const f = e.currentTarget.files?.[0];
      if (f) {
        dispatch(setState(2));
        dispatch(setFile(f));
      } else {
        openModal({
          type: 'error',
          title: `Uploaded file is incorrect. Please make sure it corresponds with the Sample file.`,
          onClick: closeAll,
        });
      }
    },
    [closeAll, dispatch, openModal, setFile, setState],
  );

  const onDelete = useCallback(
    (id: number) => {
      const newData = files && [...files];
      if (newData) {
        newData.splice(
          newData.findIndex((val) => val.idx === id),
          1,
        );
        dispatch(setFiles(newData));
      }
    },
    [dispatch, files, setFiles],
  );

  const onApprove = useCallback(async () => {
    if (files) {
      setLoadingFreeze(true);
      const addresses = files.map((line) => line.address);
      const tokens = files.map((line) => line.amount);
      const freezeTime = files.map((line) => line.data);
      await approveFreeze(addresses, tokens, freezeTime);
      setLoadingFreeze(false);
      dispatch(setState(1));
      dispatch(setFile(null));
      dispatch(setFiles([]));
    }
  }, [approveFreeze, dispatch, files, setFile, setFiles, setState]);

  const onProceed = useCallback(() => {
    ReadFile();
  }, [ReadFile]);

  const onSample = useCallback(async () => {
    const csvExampleText = await fetch('/src/assets/files/sample.csv')
      .then((res) => res.text())
      .then((text) => text);
    const csvFile = new Blob([csvExampleText], { type: 'text/csv' });
    dispatch(setFile(new File([csvFile], 'sample.csv')));
    dispatch(setState(2));
  }, [dispatch, setFile, setState]);

  return (
    <div className={s.wrapper}>
      <Button
        onChange={onFileLoad}
        id="connect"
        type="file"
        name={file?.name || 'Upload CSV file'}
        isLoading={isLoading}
        className={s.load}
      />
      {state === 1 && (
        <button className={s.sample} onClick={onSample} type="button">
          Sample file
        </button>
      )}
      {files && state === 3 && files?.length > 0 && (
        <div className={s.csvData}>
          <Table data={files} onDelete={onDelete} />
        </div>
      )}
      {state !== 1 && (
        <Button
          className={s.approve}
          onClick={state === 3 ? onApprove : onProceed}
          id="approve"
          type="button"
          name={state === 3 ? 'Approve' : 'Proceed'}
          theme="purple"
          disabled={state === 3 && +balance < calcTotal(files || [])}
          isLoading={loadingFreeze}
        />
      )}
    </div>
  );
};

export default LoadCSV;
