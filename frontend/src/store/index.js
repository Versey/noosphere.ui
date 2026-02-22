import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import mindMapperReducer from './mind-mapper/mind-mapper-slice';
import rootSaga from './root-saga';

export function createAppStore() {
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer: {
      mindMapper: mindMapperReducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: false
      }).concat(sagaMiddleware)
  });

  sagaMiddleware.run(rootSaga);
  return store;
}

const store = createAppStore();

export default store;
