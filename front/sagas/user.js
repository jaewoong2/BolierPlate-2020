import { takeLatest, delay, call, fork, all, put } from "redux-saga/effects"
import { LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE } from "../reducer/user"
import axios from 'axios';



function loginAPI(data) {
    return axios.post('/user/login', data)
}

function* login(action) {
    try {  
        //  const result = yield call(loginAPI, action.data)
         yield delay(4000)
        yield put({
            type : LOG_IN_SUCCESS,
            data : action.data
        })
        
    } catch(err) {
        console.error(err)
        yield put({
            type : LOG_IN_FAILURE,
            error : err.response.data
        })
    }
}

function* watchLogin() {
    yield takeLatest(LOG_IN_REQUEST, login);
}


export default function* userSaga() {
    yield all([
        fork(watchLogin),
    ])
}