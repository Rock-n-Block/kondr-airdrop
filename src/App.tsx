import { FC, useEffect } from 'react';

import { Header, Modal } from 'components';

import { Home } from 'pages';

import { useModals } from 'services/ModalsContext';

const App: FC = () => {
  const { openModal, closeAll } = useModals();

  useEffect(() => {
    if (!window.ethereum) {
      openModal({
        type: 'error',
        title: `Metamask extension not found. Please use Metamask compatible browser like Google Chrome.`,
        onClick: closeAll,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
