import { VFC } from 'react';

import { Button } from 'components';

import { useModals } from 'services/ModalsContext';
import { TModalStatus } from 'types';

import { CloseSVG, ErrorSVG, SuccessSVG } from 'assets/img';

import s from './styles.module.scss';

const getSvgStatus = (type: TModalStatus) => {
  switch (type) {
    case 'error':
      return <ErrorSVG />;
    case 'success':
      return <SuccessSVG />;
    default:
      return <div />;
  }
};

const Modal: VFC = () => {
  const { closeAll, modals, modalState } = useModals();

  const { type, title, info, onClick } = modalState;

  return (
    <section
      className={`${s.background} ${modals.length !== 0 && s.active}`}
      onClick={() => closeAll()}
      onKeyDown={() => {}}
      role="button"
      tabIndex={0}
    >
      <div className={s.wrapper}>
        <button onClick={closeAll} type="button" className={s.cross}>
          <CloseSVG />
        </button>
        <div className={s.status}>{getSvgStatus(type)}</div>
        <span className={s.text}>{title}</span>
        {info && <div className={s.info}>{info}</div>}
        {onClick && (
          <Button className={s.button} id="modal" theme="black" onClick={onClick} name="OK" />
        )}
      </div>
    </section>
  );
};

export default Modal;
