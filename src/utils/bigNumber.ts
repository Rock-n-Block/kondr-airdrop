import BigNumber from 'bignumber.js';

import { chains } from 'config';

import { chainsEnum } from 'types';

const contracts = chains[chainsEnum.Ethereum].network.nativeCurrency;

export const normalizedValue = (
  value: string | number,
  fixed?: number,
  number = false,
  decimal = contracts?.decimals || 18,
): number | string => {
  const decimals = 10 ** decimal;
  const amount = new BigNumber(value).div(decimals);
  const amountDecimals = amount.decimalPlaces();
  const amountReturn = amount.toNumber();

  // eslint-disable-next-line no-nested-ternary
  return number
    ? fixed === 0
      ? +amountReturn
      : +amount.toFixed(fixed || amountDecimals)
    : amount.toFixed(amountDecimals);
};

export const deNormalizedValue = (
  value: string | number,
  decimal = contracts?.decimals || 18,
  fixed = false,
): string => {
  const decimals = 10 ** decimal;
  const amount = new BigNumber(value).multipliedBy(decimals);
  return fixed ? amount.toFixed(0, 1) : amount.toFixed(0);
};

export const toFixedNumber = (value: string) => {
  return value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : value;
};
