import produce from 'immer'


const initialState = {
    loginLoading: false,
    loginDone: false,
    loginError: null,

    logoutLoading: false,
    logoutDone: false,
    logoutError: null,

    loadUserInfoLoading: false,
    loadUserInfoDone: false,
    loadUserInfoError: null,

    registerUserLoading : false,
    registerUserDone : false,
    registerUserError : null,

    loginInfo: {},
    userInfo : {},
}

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS';
export const REGISTER_USER_FAILURE = 'REGISTER_USER_FAILURE';
export const REGISTER_USER_REQUEST = 'REGISTER_USER_REQUEST';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const LOAD_USERINFO_REQUEST = 'LOAD_USERINFO_REQUEST';
export const LOAD_USERINFO_SUCCESS = 'LOAD_USERINFO_SUCCESS';
export const LOAD_USERINFO_FAILURE = 'LOAD_USERINFO_FAILURE';

const reducer = (state = initialState, action) => {
    return produce(state, draft => {
        switch (action.type) {
            case LOG_IN_REQUEST:
                draft.loginLoading = true;
                draft.loginDone = false;
                draft.loginError = null;
                break;

            case LOG_IN_SUCCESS:
                draft.loginLoading = false;
                draft.loginDone = true;
                draft.loginInfo = action.data;
                break;

            case LOG_IN_FAILURE:
                draft.loginLoading = true;
                draft.loginDone = false;
                draft.loginError = error.data;
                break;

                // 로그인
                // 로그아웃

                case LOG_OUT_REQUEST:
                    draft.logoutLoading = true;
                    draft.logoutDone = false;
                    draft.logoutError = error.data;
                    break;
    
                case LOG_OUT_SUCCESS:
                    draft.logoutLoading = false;
                    draft.logoutDone = true;
                    draft.loginInfo = {};
                    break;
    
                case LOG_OUT_FAILURE:
                    draft.logoutLoading = true;
                    draft.logoutDone = false;
                    draft.loginDone = false;
                    draft.logoutError = error.data;
                    break;
    
                //로그아웃
                //유저 정보 불러오기
                case LOAD_USERINFO_REQUEST:
                    draft.loadUserInfoLoading = true;
                    draft.loadUserInfoDone = false;
                    draft.loadUserInfoError = null;
                    break;
    
                case LOAD_USERINFO_SUCCESS:
                    draft.loadUserInfoLoading = false;
                    draft.loadUserInfoDone = true;
                    draft.loginInfo = action.data;
                    break;
    
                case LOAD_USERINFO_FAILURE:
                    draft.loadUserInfoLoading = true;
                    draft.loadUserInfoDone = false;
                    draft.logoutError = error.data;
                    break;
    
                //회원가입
                case REGISTER_USER_REQUEST:
                    draft.registerUserLoading = true;
                    draft.registerUserDone = false;
                    draft.registerUserError = null;
                    break;
    
                case REGISTER_USER_SUCCESS:
                    draft.registerUserLoading = false;
                    draft.registerUserDone = true;
                    break;
    
                case REGISTER_USER_FAILURE:
                    draft.registerUserLoading = true;
                    draft.registerUserDone = false;
                    draft.registerUserError = error.data;
                    break;
                    

            default:
                break;
        }
    })
}


export default reducer;