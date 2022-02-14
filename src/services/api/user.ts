import axios from 'axios';

import { is_production } from 'config';

axios.defaults.baseURL = is_production
  ? 'https://kon-vesting.rocknblock.io/api/v1'
  : 'https://kon-vesting.rocknblock.io/api/v1';

axios.interceptors.request.use(
  (config) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    config.headers.common = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ...config.headers.common,
      Authorization: `${
        localStorage.getItem('kondr_token') ? `Token ${localStorage.getItem('kondr_token')}` : ''
      }`,
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
  login: (data: ILogin) =>
    axios.post('accounts/metamask_login/', {
      address: data.address,
      signed_msg: data.signedMsg,
      msg: data.msg,
    }),
  getMsg: () => axios.get('accounts/get_metamask_message/'),
};
