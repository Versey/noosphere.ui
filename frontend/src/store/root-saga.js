import { all } from 'redux-saga/effects';
import { watchMindMapper } from './mind-mapper/mind-mapper-sagas';

export default function* rootSaga() {
  yield all([watchMindMapper()]);
}
