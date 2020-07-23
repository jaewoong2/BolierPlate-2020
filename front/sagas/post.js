import { takeLatest, call, fork, all, put } from "redux-saga/effects"
import axios from 'axios';
import { WRTIE_SUCCESS, WRTIE_FAILURE, WRTIE_REQUEST, LOAD_MYPOST_REQUEST, LOAD_MYPOST_SUCCESS, LOAD_MYPOST_FAILURE, UPLOAD_IMAGES_REQUEST, UPLOAD_IMAGES_FAILURE, UPLOAD_IMAGES_SUCCESS, DELETE_POST_REQUEST, DELETE_POST_SUCCESS, DELETE_POST_FAILURE } from "../reducer/post";


// 글쓰기
function writeAPI(data) {
    if(data.edit) {
        return axios.patch('/post', data);
    } else {
        return axios.post('/post', data)
    }
}

function* write(action) {
    try {  
        const result = yield call(writeAPI, action.data);
        yield put({
            type : WRTIE_SUCCESS,
            data : result.data
        })
        
    } catch(err) {
        console.error(err)
        yield put({
            type : WRTIE_FAILURE,
            error : err.response.data
        })
    }
}

function* watchWrite() {
    yield takeLatest(WRTIE_REQUEST, write);
}

// 로드마이포스트
function loadMyPostAPI() {
    return axios.get('/post')
}

function* loadMyPost() {
    try {  
         const result = yield call(loadMyPostAPI)
        yield put({
            type : LOAD_MYPOST_SUCCESS,
            data : result.data
        })
        
    } catch(err) {
        console.error(err)
        yield put({
            type : LOAD_MYPOST_FAILURE,
            error : err.response.data
        })
    }
}

function* watchLoadMyPost() {
    yield takeLatest(LOAD_MYPOST_REQUEST, loadMyPost);
}


// 글쓰기
function postImageAPI(data) {
    return axios.post('/post/image', data)
}

function* postImage(action) {
    try {  
         const result = yield call(postImageAPI, action.data)
        yield put({
            type : UPLOAD_IMAGES_SUCCESS,
            data : result.data
        })
        
    } catch(err) {
        console.error(err)
        yield put({
            type : UPLOAD_IMAGES_FAILURE,
            error : err.response.data
        })
    }
}

function* watchPostImage() {
    yield takeLatest(UPLOAD_IMAGES_REQUEST, postImage);
}

// 글쓰기
function deletePostAPI(data) {
    return axios.delete(`/post/${data}`)
}

function* deletePost(action) {
    try {  
         const result = yield call(deletePostAPI, action.data.id)
        yield put({
            type : DELETE_POST_SUCCESS,
            data : result.data
        })
        
    } catch(err) {
        console.error(err)
        yield put({
            type : DELETE_POST_FAILURE,
            error : err.response.data
        })
    }
}

function* watchDeletePost() {
    yield takeLatest(DELETE_POST_REQUEST, deletePost);
}






export default function* postSaga() {
    yield all([
        fork(watchWrite),
        fork(watchLoadMyPost),
        fork(watchPostImage),
        fork (watchDeletePost),
    ])
}