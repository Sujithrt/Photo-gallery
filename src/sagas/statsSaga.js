import {
    call,
    fork,
    put,
    take
} from "redux-saga/effects";
import { IMAGES } from "../constants";
import { fetchImageStats } from "../api";
import {
    loadImageStats,
    setImageStats,
    setImageStatsError
} from "../actions";

export function* handleStatsRequestSaga(id) {
    for (let i = 0; i < 3; i++) {
        try {
            yield put(loadImageStats(id));
            const res = yield call(fetchImageStats, id);
            yield put(setImageStats(id, res.downloads.total));
            return true;
        } catch (error) { }
    }
    yield put(setImageStatsError(id));
}

export default function* watchStatsRequest() {
    while (true) {
        const { images } = yield take(IMAGES.LOAD_SUCCESS);

        for (let i = 0; i < images.length; i++) {
            yield fork(handleStatsRequestSaga, images[i].id);
        }
    }
}