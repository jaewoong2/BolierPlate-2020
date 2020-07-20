import { all, fork } from 'redux-saga/effects'
import axios from 'axios';
import userSaga from './user';
import postSaga from './post';

axios.defaults.baseURL = 'http://localhost:3055';
axios.defaults.withCredentials = true; // 쿠키를 주고받기 위함

export default function* rootSaga() {
    yield all([
        fork(userSaga),
        fork(postSaga),
    ]);
};