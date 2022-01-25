import BigNumber from 'bignumber.js';

export default (value: string, decimals: string | number) => {
  const decimalsPlaces = value.toString().split('.')[1] ? value.toString().split('.')[1].length : 0;
  if (decimalsPlaces > +decimals) {
    return new BigNumber(value).toFixed(+decimals, 1);
  }
  return value;
};
