import { takeLatest, call, fork, all, put, throttle } from "redux-saga/effects"
import axios from 'axios';
import { WRTIE_SUCCESS, WRTIE_FAILURE, WRTIE_REQUEST, LOAD_MYPOST_REQUEST, LOAD_MYPOST_SUCCESS, LOAD_MYPOST_FAILURE, UPLOAD_IMAGES_REQUEST, UPLOAD_IMAGES_FAILURE, UPLOAD_IMAGES_SUCCESS, DELETE_POST_REQUEST, DELETE_POST_SUCCESS, DELETE_POST_FAILURE, HASHTAG_SEARCH_REQUEST, HASHTAG_SEARCH_SUCCESS, HASHTAG_SEARCH_FAILURE, LOAD_POSTS_REQUEST, LOAD_POSTS_SUCCESS, LOAD_POSTS_FAILURE } from "../reducer/post";


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
    yield throttle(2000, WRTIE_REQUEST, write);
}

// 로드 포스츠
function loadPostsAPI(lastId) {
    return axios.get(`/posts?lastId=${lastId}`)
}

function* loadPosts(action) {
    try {  
         const result = yield call(loadPostsAPI, action.lastId)
        yield put({
            type : LOAD_POSTS_SUCCESS,
            data : result.data
        })
        
    } catch(err) {
        console.error(err)
        yield put({
            type : LOAD_POSTS_FAILURE,
            error : err.response.data
        })
    }
}

function* watchLoadPosts() {
    yield takeLatest(LOAD_POSTS_REQUEST, loadPosts);
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


function hashtagSearchAPI(data, lastId) {
    return axios.get(`/post/hashtag/${data}?lastId=${lastId}`)
}

function* hashtagSearch(action) {
    try {  
         const result = yield call(hashtagSearchAPI, action.data.name, action.lastId)
        yield put({
            type : HASHTAG_SEARCH_SUCCESS,
            data : result.data,
            tagName : decodeURIComponent(action.data.name)
        })
        
    } catch(err) {
        console.error(err)
        yield put({
            type : HASHTAG_SEARCH_FAILURE,
            error : err.response.data
        })
    }
}

function* watchHashtagSearch() {
    yield takeLatest(HASHTAG_SEARCH_REQUEST, hashtagSearch);
}






export default function* postSaga() {
    yield all([
        fork(watchWrite),
        fork(watchLoadPosts),
        fork(watchPostImage),
        fork (watchDeletePost),
        fork(watchHashtagSearch)
    ])
}