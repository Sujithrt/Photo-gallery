import { runSaga } from 'redux-saga';
import {
    loadImageStats,
    setImageStats,
    setImageStatsError
} from '../../actions';
import * as api from '../../api';
import { handleStatsRequestSaga } from '../statsSaga';

test('should load image stats and handle them in case of success', async () => {
    const dispatchedActions = [];

    const fakeId = 43;
    const fakeDownloads = 12412;
    const mockedStats = { downloads: { total: fakeDownloads } };
    api.fetchImageStats = jest.fn(() => Promise.resolve(mockedStats));

    const fakeStore = {
        dispatch: action => dispatchedActions.push(action)
    };

    await runSaga(fakeStore, handleStatsRequestSaga, fakeId).done;
    expect(api.fetchImageStats.mock.calls.length).toBe(1);
    expect(dispatchedActions).toContainEqual(setImageStats(fakeId, fakeDownloads));
});

test('should load image stats and handle them in case of success', async () => {
    const dispatchedActions = [];

    const fakeId = 43;
    const fakeDownloads = 12412;
    api.fetchImageStats = jest.fn(() => Promise.reject());

    const fakeStore = {
        dispatch: action => dispatchedActions.push(action)
    };

    await runSaga(fakeStore, handleStatsRequestSaga, fakeId).done;
    expect(api.fetchImageStats.mock.calls.length).toBe(3);
    expect(dispatchedActions).toContainEqual(setImageStatsError(fakeId));
});
