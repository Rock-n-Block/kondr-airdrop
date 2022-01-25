import { FC, useEffect } from 'react';

import { Header, Modal } from 'components';

import { Home } from 'pages';

import { useModals } from 'services/ModalsContext';

const App: FC = () => {
  const { openModal, closeAll } = useModals();

  useEffect(() => {
    if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
      openModal({
        type: 'error',
        title: `Metamask extension not found. Please use Metamask compatible browser like Google Chrome.`,
        onClick: closeAll,
      });
    }
  }, [closeAll, openModal]);

  return (
    <main className="main_wrapper">
      <Modal />
      <Header />
      <div className="page_wrapper">
        <Home />
      </div>
    </main>
  );
};
export default App;
