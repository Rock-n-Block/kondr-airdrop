import { useCallback, useState } from 'react';

const useModal = (initialVisible: boolean): [boolean, () => void, () => void] => {
  const [isVisibleModal, setVisibleModal] = useState(initialVisible);

  const handleOpenModal = useCallback(() => {
    setVisibleModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setVisibleModal(false);
  }, []);

  return [isVisibleModal, handleOpenModal, handleCloseModal];
};

export default useModal;
