import { VFC } from 'react';

import { Logo } from 'assets/img';

import s from './styles.module.scss';

const Header: VFC = () => {
  return (
    <header className={s.wrapper}>
      <div className={s.body}>
        <Logo className={s.logo} />
        <span className={s.powered}>Powered by KON Token, Fueling the Ecosystem</span>
        <a className={s.contact} href="https://kondr.io/#contacts" target="_blank" rel="noreferrer">
          Contact
        </a>
      </div>
    </header>
  );
};

export default Header;
