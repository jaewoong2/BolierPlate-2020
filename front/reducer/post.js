import produce from "immer";

const initialState = {
  wrtieLoading: false,
  wrtieDone: false,
  wrtieError: null,

  loadMyPostLoading: false,
  loadMyPostDone: false,
  loadMyPostError: null,

  uploadImagesLoading: false,
  uploadImagesDone: false,
  uploadImagesError: null,

  ImagePaths: [],
  myPost: [],
};

export const WRTIE_REQUEST = "WRTIE_REQUEST";
export const WRTIE_SUCCESS = "WRTIE_SUCCESS";
export const WRTIE_FAILURE = "WRTIE_FAILURE";

export const LOAD_MYPOST_REQUEST = "LOAD_MYPOST_REQUEST";
export const LOAD_MYPOST_SUCCESS = "LOAD_MYPOST_SUCCESS";
export const LOAD_MYPOST_FAILURE = "LOAD_MYPOST_FAILURE";

export const UPLOAD_IMAGES_SUCCESS = "UPLOAD_IMAGES_SUCCESS";
export const UPLOAD_IMAGES_FAILURE = "UPLOAD_IMAGES_FAILURE";
export const UPLOAD_IMAGES_REQUEST = "UPLOAD_IMAGES_REQUEST";

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case WRTIE_REQUEST:
        draft.wrtieLoading = true;
        draft.wrtieDone = false;
        draft.wrtieError = null;
        break;
      case WRTIE_SUCCESS:
        draft.wrtieLoading = false;
        draft.wrtieDone = true;
        break;
      case WRTIE_FAILURE:
        draft.wrtieLoading = false;
        draft.wrtieDone = true;
        draft.wrtieError = action.error;
        break;

      case LOAD_MYPOST_REQUEST:
        draft.loadMyPostLoading = true;
        draft.loadMyPostDone = false;
        draft.loadMyPostError = null;
        break;
      case LOAD_MYPOST_SUCCESS:
        draft.loadMyPostLoading = false;
        draft.loadMyPostDone = true;
        draft.myPost = action.data;
        break;
      case LOAD_MYPOST_FAILURE:
        draft.loadMyPostLoading = false;
        draft.loadMyPostDone = true;
        draft.loadMyPostError = action.error;
        break;

      case UPLOAD_IMAGES_REQUEST:
        draft.uploadImagesLoading = true;
        draft.uploadImagesDone = false;
        draft.uploadImagesError = null;
        break;
      case UPLOAD_IMAGES_SUCCESS:
        draft.uploadImagesLoading = false;
        draft.uploadImagesDone = true;
        draft.ImagePaths = draft.ImagePaths.concat(action.data);
        break;
      case UPLOAD_IMAGES_FAILURE:
        draft.uploadImagesLoading = false;
        draft.uploadImagesDone = true;
        draft.uploadImagesError = action.error;
        break;

      default:
        break;
    }
  });
};

export default reducer;
