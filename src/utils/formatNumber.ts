type TFormat = 'withCommas' | 'compact';

export const formatNumber = (value: string, format: TFormat = 'withCommas') => {
  switch (format) {
    case 'withCommas': {
      return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    case 'compact': {
      const suf = ['', 'k', 'm', 'b', 't'];
      const sufNum = Math.floor(`${value}`.length / 3);
      let compact = parseFloat(sufNum !== 0 ? (+value / 1000 ** sufNum).toString() : value);
      if (compact % 1 !== 0) {
        compact = +compact.toFixed(1);
      }
      return compact.toString() + suf[sufNum];
    }
    default: {
      return value;
    }
  }
};
