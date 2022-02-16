import axios from 'axios';

import { is_production } from 'config';
import { deNormalizedValue } from 'utils';

import { AirdropStatus, CSVLine } from 'types';

axios.defaults.baseURL = is_production
  ? 'https://kon-vesting.rocknblock.io/api/v1'
  : 'https://kon-vesting.rocknblock.io/api/v1';

axios.interceptors.request.use(
  (config) => {
    const RawTokenData = localStorage.getItem('kondr_token');
    const token = RawTokenData ? JSON.parse(RawTokenData) : null;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    config.headers.common = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ...config.headers.common,
      Authorization: `${token ? `Token ${token.token}` : ''}`,
    };

    return config;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  },
);

interface ILogin {
  address: string;
  signedMsg: string;
  msg: string;
}

export default {
  login: (data: ILogin, type: 'post' | 'patch' = 'post') =>
    axios[type]('accounts/metamask_login/', {
      address: data.address,
      signed_msg: data.signedMsg,
      msg: data.msg,
    }),
  getMsg: () => axios.get('accounts/get_metamask_message/'),
  sendData: (data: CSVLine[]) =>
    axios.post('users/', {
      drop: data.map((file) => ({
        address: file.address.toLowerCase(),
        date: file.data,
        amount: deNormalizedValue(file.amount),
      })),
    }),
  getData: (address?: string, status?: AirdropStatus) =>
    axios.get(
      `users/?address=${address || ''}${status ? `&status=${status?.toUpperCase() || ''}` : ''}`,
    ),
  sendStatus: (amount: string, date: number, tx_hash: string) =>
    axios.post('status_update/', {
      amount,
      date,
      tx_hash,
    }),
};
