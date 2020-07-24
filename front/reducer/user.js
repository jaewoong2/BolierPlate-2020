import produce from "immer";

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

  registerUserLoading: false,
  registerUserDone: false,
  registerUserError: null,

  uploadProfileImageLoading: false,
  uploadProfileImageDone: false,
  uploadProfileImageError: null,

  changeNicknameLoading: false,
  changeNicknameDone: false,
  changeNicknameError: false,

  changeIntroduceLoading: false,
  changeIntroduceDone: false,
  changeIntroduceError: false,

  loginInfo: {},
  userInfo: {},
};

export const LOG_IN_REQUEST = "LOG_IN_REQUEST";
export const LOG_IN_SUCCESS = "LOG_IN_SUCCESS";
export const LOG_IN_FAILURE = "LOG_IN_FAILURE";

export const REGISTER_USER_SUCCESS = "REGISTER_USER_SUCCESS";
export const REGISTER_USER_FAILURE = "REGISTER_USER_FAILURE";
export const REGISTER_USER_REQUEST = "REGISTER_USER_REQUEST";

export const LOG_OUT_REQUEST = "LOG_OUT_REQUEST";
export const LOG_OUT_SUCCESS = "LOG_OUT_SUCCESS";
export const LOG_OUT_FAILURE = "LOG_OUT_FAILURE";

export const LOAD_USERINFO_REQUEST = "LOAD_USERINFO_REQUEST";
export const LOAD_USERINFO_SUCCESS = "LOAD_USERINFO_SUCCESS";
export const LOAD_USERINFO_FAILURE = "LOAD_USERINFO_FAILURE";

export const UPLOAD_PROFILE_IMAGES_REQUEST = "UPLOAD_PROFILE_IMAGES_REQUEST";
export const UPLOAD_PROFILE_IMAGES_SUCCESS = "UPLOAD_PROFILE_IMAGES_SUCCESS";
export const UPLOAD_PROFILE_IMAGES_FAILURE = "UPLOAD_PROFILE_IMAGES_FAILURE";

export const LOAD_MYINFO_REQUEST = "LOAD_MYINFO_REQUEST";
export const LOAD_MYINFO_SUCCESS = "LOAD_MYINFO_SUCCESS";
export const LOAD_MYINFO_FAILURE = "LOAD_MYINFO_FAILURE";

export const CHANGE_NICKNAME_REQUEST = "CHANGE_NICKNAME_REQUEST";
export const CHANGE_NICKNAME_SUCCESS = "CHANGE_NICKNAME_SUCCESS";
export const CHANGE_NICKNAME_FAILURE = "CHANGE_NICKNAME_FAILURE";


export const CHANGE_INTRODUCE_REQUEST = "CHANGE_INTRODUCE_REQUEST";
export const CHANGE_INTRODUCE_SUCCESS = "CHANGE_INTRODUCE_SUCCESS";
export const CHANGE_INTRODUCE_FAILURE = "CHANGE_INTRODUCE_FAILURE";

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
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
        draft.loginLoading = false;
        draft.loginDone = true;
        draft.loginError = action.error;
        break;

      // 로그인
      // 로그아웃

      case LOG_OUT_REQUEST:
        draft.logoutLoading = true;
        draft.logoutDone = false;
        draft.logoutError = null;
        break;

      case LOG_OUT_SUCCESS:
        draft.logoutLoading = false;
        draft.logoutDone = true;
        draft.loginDone = false;
        draft.loginInfo = {};
        break;

      case LOG_OUT_FAILURE:
        draft.logoutLoading = true;
        draft.logoutDone = false;
        draft.logoutError = action.error;
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
        draft.userInfo = action.data;
        break;

      case LOAD_USERINFO_FAILURE:
        draft.loadUserInfoLoading = true;
        draft.loadUserInfoDone = false;
        draft.logoutError = action.error;
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
        draft.registerUserLoading = false;
        draft.registerUserDone = true;
        draft.registerUserError = action.error;
        break;

      case UPLOAD_PROFILE_IMAGES_REQUEST:
        draft.uploadProfileImageLoading = true;
        draft.uploadProfileImageDone = false;
        draft.uploadProfileImageError = null;
        break;

      case UPLOAD_PROFILE_IMAGES_SUCCESS:
        draft.uploadProfileImageLoading = false;
        draft.uploadProfileImageDone = true;
        draft.loginInfo = action.data;
        break;

      case UPLOAD_PROFILE_IMAGES_FAILURE:
        draft.uploadProfileImageLoading = false;
        draft.uploadProfileImageDone = true;
        draft.uploadProfileImageError = action.error;
        break;

      //내 정보 불러오기
      case LOAD_MYINFO_REQUEST:
        draft.loadUserInfoLoading = true;
        draft.loadUserInfoDone = false;
        draft.loadUserInfoError = null;
        break;

      case LOAD_MYINFO_SUCCESS:
        draft.loadUserInfoLoading = false;
        draft.loadUserInfoDone = true;
        draft.loginInfo = action.data;
        break;

      case LOAD_MYINFO_FAILURE:
        draft.loadUserInfoLoading = false;
        draft.loadUserInfoDone = true;
        draft.loadUserInfoError = action.error;
        break;

      //내 닉네임 변경하기
      case CHANGE_NICKNAME_REQUEST:
        draft.changeNicknameLoading = true;
        draft.changeNicknameDone = false;
        draft.changeNicknameError = null;
        break;

      case CHANGE_NICKNAME_SUCCESS:
        draft.changeNicknameLoading = false;
        draft.changeNicknameDone = true;
        draft.loginInfo.nickname = action.data.nickname ;
        break;

      case CHANGE_NICKNAME_FAILURE:
        draft.changeNicknameLoading = true;
        draft.changeNicknameDone = false;
        draft.changeNicknameDone = action.error;
        break;

              //내 닉네임 변경하기
      case CHANGE_INTRODUCE_REQUEST:
        draft.changeIntroduceLoading = true;
        draft.changeIntroduceDone = false;
        draft.changeIntroduceError = null;
        break;

      case CHANGE_INTRODUCE_SUCCESS:
        draft.changeIntroduceLoading = false;
        draft.changeIntroduceDone = true;
        draft.loginInfo = action.data;
        break;

      case CHANGE_INTRODUCE_FAILURE:
        draft.changeIntroduceLoading = true;
        draft.changeIntroduceDone = false;
        draft.changeIntroduceDone = action.error;
        break;

      default:
        break;
    }
  });
};

export default reducer;
