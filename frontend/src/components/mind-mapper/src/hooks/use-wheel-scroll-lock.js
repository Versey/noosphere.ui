import { useEffect } from 'react';

function useWheelScrollLock(viewportRef) {
  useEffect(() => {
    const element = viewportRef.current;
    if (!element) {
      return undefined;
    }

    function preventPageWheel(event) {
      event.preventDefault();
      event.stopPropagation();
    }

    element.addEventListener('wheel', preventPageWheel, { passive: false });

    return () => {
      element.removeEventListener('wheel', preventPageWheel);
    };
  }, [viewportRef]);
}

export default useWheelScrollLock;
