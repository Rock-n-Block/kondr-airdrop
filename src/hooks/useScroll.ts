import { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface IUseScroll {
  (state?: boolean): { scrollState: boolean; setScrollState: Dispatch<SetStateAction<boolean>> };
}

/**
 * @param {boolean} state - initial state of scroll
 * @returns {scrollState, setScrollState}
 */

const useScroll: IUseScroll = (state = true) => {
  const [scroll, setScroll] = useState(state);

  useEffect(() => {
    const body = document.querySelector('body');
    if (body) {
      if (scroll) {
        body.style.overflowY = 'auto';
      } else {
        body.style.overflowY = 'hidden';
      }
    }
  }, [scroll]);

  return { scrollState: scroll, setScrollState: setScroll };
};

export default useScroll;