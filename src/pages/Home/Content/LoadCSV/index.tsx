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

function getRandomIntInclusive(min: number, max: number) {
  const minimal = Math.ceil(min);
  const maximal = Math.floor(max);
  return Math.floor(Math.random() * (maximal - minimal + 1)) + minimal;
}

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
              const [address, amount, data] = line
                .replaceAll('"', '')
                .replaceAll(';', ',')
                .split(',');
              if (!web3utils.checkAddressChecksum(address)) {
                err.push(`error address at line ${key + 1}\n${address}`);
                return;
              }
              if (
                Number.isNaN(parseInt(data, 10)) ||
                new Date(parseInt(data, 10) * 1000).getTime() < Date.now() ||
                Number.isNaN(new Date(parseInt(data, 10) * 1000))
              ) {
                err.push(`error date at line ${key + 1}\n${data}`);
                return;
              }
              if (Number.isNaN(parseFloat(amount))) {
                err.push(`error amount at line ${key + 1}\n${amount}`);
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
            CSVData.map((val) => `${val.address} ${new Date(+val.data * 1000)} ${val.amount}\n`),
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
        if (newData.length === 0) {
          dispatch(setState(1));
          dispatch(setFile(null));
          dispatch(setFiles([]));
        } else {
          dispatch(setFiles(newData));
        }
      }
    },
    [dispatch, files, setFile, setFiles, setState],
  );

  const onApprove = useCallback(async () => {
    if (files) {
      setLoadingFreeze(true);
      const addresses = files.map((line) => line.address);
      const tokens = files.map((line) => line.amount);
      const freezeTime = files.map((line) => line.data.replace('\r', ''));
      try {
        await approveFreeze(addresses, tokens, freezeTime);
      } catch {
        dispatch(setIsLoading(false));
      }
      setLoadingFreeze(false);
    }
  }, [approveFreeze, dispatch, files, setIsLoading]);

  const onProceed = useCallback(() => {
    ReadFile();
  }, [ReadFile]);

  const onSample = useCallback(async () => {
    const addrs = [
      '0x063C22e0917b4B051cb81Ef91c5052Cd8C0D0E56',
      '0xBF7E42e9254A5E64D946bD206120ae5BafaC7781',
      '0x4d9806EB6FF37a8ab8375058CB43556Aa5763Db0',
    ];
    const repeats = 2;
    const delay = 20 * 60;
    const timestamp = Date.now() / 1000 + delay;
    const csvData: any[] = [];
    for (let i = 0; i < repeats; i += 1) {
      addrs.forEach((addr) => {
        csvData.push([addr, getRandomIntInclusive(1, 1000), timestamp]);
      });
    }
    const csvExampleText = csvData.reduce(
      (acc, value) => `${acc}${value[0]},${value[1]},${Math.ceil(value[2])}\n`,
      '',
    );
    logger('Generated Data', csvExampleText);
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
