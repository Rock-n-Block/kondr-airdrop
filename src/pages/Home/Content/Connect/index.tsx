import { useCallback, VFC } from 'react';

import { useTypedSelector } from 'store';

import { Button } from 'components';

import { useWalletConnectorContext } from 'services/WalletConnect';
import { chainsEnum } from 'types';

import s from '../styles.module.scss';

const Connection: VFC = () => {
  const { connect } = useWalletConnectorContext();
  const { address, isLoading } = useTypedSelector((state) => state.UserReducer);

  const onConnectClick = useCallback(() => {
    if (!address) {
      connect(chainsEnum.Ethereum, 'MetaMask');
    } else {
      window.navigator.clipboard.writeText(address);
    }
  }, [address, connect]);

  return (
    <div className={s.wrapper}>
      <Button
        onClick={onConnectClick}
        id="connect"
        type="button"
        name={address || 'Connect Metamask'}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Connection;
