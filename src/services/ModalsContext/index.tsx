import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useScroll } from 'hooks';
import { IModals } from 'types';

enum EModalState {
  in,
  ready,
  out,
}

type ModalsTypes = {
  name: string;
  state: EModalState;
};

interface IModalsContext {
  modals: Array<ModalsTypes>;
  playingAnim: string[];
  playingAnimOut: string[];
  isActive: (name: string) => boolean;
  isReady: (name: string) => boolean;
  setModal: (name: string) => void;
  closeModal: (name: string) => void;
  closeAll: () => void;
  modalState: IModals;
  openModal: (state: IModals) => void;
}

const animDelay = 100;

const ModalsContext = createContext<IModalsContext>({} as IModalsContext);

const ModalsProvider: React.FC = ({ children }) => {
  const [modals, setModals] = useState<ModalsTypes[]>([]);
  const [playingAnim, setPlayingAnim] = useState<string[]>([]);
  const [playingAnimOut, setPlayingAnimOut] = useState<string[]>([]);
  const [modalState, setModalState] = useState<IModals>({ type: 'success', title: '' });

  const setModal = useCallback((name: string) => {
    setModals((prevState) => [
      ...prevState
        .filter((queue) => queue.name !== name)
        .map((queue) => ({ ...queue, state: EModalState.out })),
      { name, state: EModalState.in },
    ]);
    setPlayingAnim((prev) => [...prev, name]);
    setTimeout(() => {
      setPlayingAnim((prev) => [...prev.filter((queue) => queue !== name)]);
      setModals([{ name, state: EModalState.ready }]);
    }, animDelay + 200);
  }, []);

  const openModal = useCallback(
    (state: IModals) => {
      const { type, title, info, onClick } = state;
      setModalState({ type, title, info, onClick });
      setModal('modal');
    },
    [setModal],
  );

  const isActive = useCallback(
    (name: string) => {
      return modals.findIndex((queue) => queue.name === name) !== -1;
    },
    [modals],
  );

  const isReady = useCallback(
    (name: string) => {
      return modals.find((queue) => queue.name === name)?.state === EModalState.ready;
    },
    [modals],
  );

  const closeAll = useCallback(() => {
    setPlayingAnimOut(modals.map((queue) => queue.name));
    setModals((prevState) => [...prevState.map((queue) => ({ ...queue, state: EModalState.out }))]);
    setTimeout(() => {
      setModals([]);
      setPlayingAnimOut([]);
      setPlayingAnim([]);
    }, animDelay);
  }, [modals]);

  const closeModal = useCallback((name: string) => {
    setModals((prevState) => [
      // eslint-disable-next-line no-confusing-arrow
      ...prevState.map((queue) =>
        queue.name === name ? { ...queue, state: EModalState.out } : queue,
      ),
    ]);
    setPlayingAnimOut((prev): string[] => [...prev, name]);
    setTimeout(() => {
      setModals((prevState) => [...prevState.filter((queue) => queue.name !== name)]);
      setPlayingAnimOut((prev) => [...prev.filter((queue) => queue !== name)]);
    }, animDelay);
  }, []);

  const { setScrollState } = useScroll(false);

  useEffect(() => {
    if (modals.length > 0) setScrollState(false);
    else setScrollState(true);
  }, [modals, setScrollState]);

  const values = useMemo(
    () => ({
      setModal,
      isActive,
      playingAnim,
      modals,
      playingAnimOut,
      isReady,
      closeModal,
      closeAll,
      modalState,
      openModal,
    }),
    [
      closeAll,
      closeModal,
      isActive,
      isReady,
      modalState,
      modals,
      openModal,
      playingAnim,
      playingAnimOut,
      setModal,
    ],
  );

  return <ModalsContext.Provider value={values}>{children}</ModalsContext.Provider>;
};

export const useModals = () => {
  return useContext(ModalsContext);
};

export default ModalsProvider;
