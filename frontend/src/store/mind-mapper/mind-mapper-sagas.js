import { call, put, select, takeLatest } from 'redux-saga/effects';
import mindMapperService from '../../services/mind-mapper-service';
import {
  createMap,
  deleteMap,
  renameMap,
  saveActiveMap,
  saveActiveMapRequested,
  selectMindMapperState
} from './mind-mapper-slice';

function* persistMindMapperState() {
  const state = yield select(selectMindMapperState);
  const payload = {
    maps: state.maps,
    activeMapId: state.activeMapId,
    savedAt: Date.now()
  };

  yield call(mindMapperService.persistMaps, payload);
}

function* saveAndPersist() {
  yield put(saveActiveMap());
  yield call(persistMindMapperState);
}

export function* watchMindMapper() {
  yield takeLatest(saveActiveMapRequested.type, saveAndPersist);
  yield takeLatest(createMap.type, persistMindMapperState);
  yield takeLatest(deleteMap.type, persistMindMapperState);
  yield takeLatest(renameMap.type, persistMindMapperState);
}
