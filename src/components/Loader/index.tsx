import { VFC } from 'react';

import { LoaderSVG } from 'assets/img';

import s from './styles.module.scss';

interface ILoader {
  className?: string;
}

const Loader: VFC<ILoader> = ({ className }) => {
  return <LoaderSVG className={`${className} ${s.loader}`} />;
};

export default Loader;
