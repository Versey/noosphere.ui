import { useState } from 'react';
import { cloneMapState } from '../helpers/mind-mapper-utils';

function useMindMapHistory() {
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);

  function pushSnapshot(state) {
    setPast((prev) => [...prev, cloneMapState(state)]);
    setFuture([]);
  }

  function undo(currentState, applyState) {
    setPast((prev) => {
      if (prev.length === 0) {
        return prev;
      }

      const previousState = prev[prev.length - 1];
      setFuture((next) => [...next, cloneMapState(currentState)]);
      applyState(previousState);
      return prev.slice(0, -1);
    });
  }

  function redo(currentState, applyState) {
    setFuture((prev) => {
      if (prev.length === 0) {
        return prev;
      }

      const nextState = prev[prev.length - 1];
      setPast((nextPast) => [...nextPast, cloneMapState(currentState)]);
      applyState(nextState);
      return prev.slice(0, -1);
    });
  }

  function clear() {
    setPast([]);
    setFuture([]);
  }

  return {
    pushSnapshot,
    undo,
    redo,
    clear,
    canUndo: past.length > 0,
    canRedo: future.length > 0
  };
}

export default useMindMapHistory;
