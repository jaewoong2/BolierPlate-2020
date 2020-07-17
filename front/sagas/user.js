import { takeLatest, delay, call, fork, all, put } from "redux-saga/effects"
import { LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE,
        LOG_OUT_REQUEST, LOG_OUT_FAILURE, LOG_OUT_SUCCESS, LOAD_USERINFO_SUCCESS, LOAD_USERINFO_FAILURE, LOAD_USERINFO_REQUEST, REGISTER_USER_REQUEST, REGISTER_USER_FAILURE, REGISTER_USER_SUCCESS
} from "../reducer/user"
import axios from 'axios';


// 로그인
function loginAPI(data) {
    return axios.post('/user/login', data)
}

function* login(action) {
    try {  
         const result = yield call(loginAPI, action.data)
        //  yield delay(1000)
        yield put({
            type : LOG_IN_SUCCESS,
            data : result.data
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

// 로그아웃
function logoutAPI(data) {
    return axios.post('/user/logout')
}

function* logout(action) {
    try {  
         const result = yield call(logoutAPI, action.data)
        //  yield delay(1000)
        yield put({
            type : LOG_OUT_SUCCESS,
            data : result.data
        })
    } catch(err) {
        console.error(err)
        yield put({
            type : LOG_OUT_FAILURE,
            error : err.response.data
        })
    }
}

function* watchLogout() {
    yield takeLatest(LOG_OUT_REQUEST, logout);
}


// 유저 정보 불러오기
function loadUserInfoAPI(data) {
    return axios.get(`/user/${data}`)
}

function* loadUserInfo(action) {
    try {
        // const result = yield call(loadUserInfoAPI, action.data)
        yield delay(1500)
        yield put({
            type : LOAD_USERINFO_SUCCESS,
            data : action.data
        })
    } catch (err) {
        console.error(err)
        yield put({
            type : LOAD_USERINFO_FAILURE,
            error : err.response.data
        })
    }
}

function* watchLoadUserInfo() {
    yield takeLatest(LOAD_USERINFO_REQUEST, loadUserInfo);
}

//회원가입
function registerAPI(data) {
    return axios.post('/user', data)
}

function* register(action) {
    try {
        const result = yield call(registerAPI, action.data)
        yield put({
            type : REGISTER_USER_SUCCESS,
            data : result.data
        })
    } catch (err) {
        console.error(err)
        yield put({
            type : REGISTER_USER_FAILURE,
            error : err.response.data
        })
    }
}

function* watchRegister() {
    yield takeLatest(REGISTER_USER_REQUEST, register);
}

export default function* userSaga() {
    yield all([
        fork(watchLogin),
        fork(watchLogout),
        fork(watchLoadUserInfo),
        fork(watchRegister),
    ])
}