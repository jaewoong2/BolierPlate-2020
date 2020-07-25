import produce from "immer";

const initialState = {
  wrtieLoading: false,
  wrtieDone: false,
  wrtieError: null,

  loadPostsLoading: false,
  loadPostsDone: false,
  loadPostsError: null,

  uploadImagesLoading: false,
  uploadImagesDone: false,
  uploadImagesError: null,
  
  deletePostLoading : false,
  deletePostDone : false,
  deletePostError: null,

  hashtagSearchLoading : false,
  hashtagSearchDone : false,
  hashtagSearchError: null,

  InfinityScroll : true,
  toggleTag : false,
  tagName : '',
  ImagePaths: [],
  PostsData: [],
};

export const TOGGLE_TAG = 'TOGGLE_TAG';

export const WRTIE_REQUEST = "WRTIE_REQUEST";
export const WRTIE_SUCCESS = "WRTIE_SUCCESS";
export const WRTIE_FAILURE = "WRTIE_FAILURE";

export const LOAD_POSTS_REQUEST = "LOAD_POSTS_REQUEST";
export const LOAD_POSTS_SUCCESS = "LOAD_POSTS_SUCCESS";
export const LOAD_POSTS_FAILURE = "LOAD_POSTS_FAILURE";

export const UPLOAD_IMAGES_SUCCESS = "UPLOAD_IMAGES_SUCCESS";
export const UPLOAD_IMAGES_FAILURE = "UPLOAD_IMAGES_FAILURE";
export const UPLOAD_IMAGES_REQUEST = "UPLOAD_IMAGES_REQUEST";

export const DELETE_POST_REQUEST = 'DELETE_POST_REQUEST'
export const DELETE_POST_SUCCESS = 'DELETE_POST_SUCCESS'
export const DELETE_POST_FAILURE = 'DELETE_POST_FAILURE'

export const HASHTAG_SEARCH_REQUEST = 'HASHTAG_SEARCH_REQUEST'
export const HASHTAG_SEARCH_SUCCESS = 'HASHTAG_SEARCH_SUCCESS'
export const HASHTAG_SEARCH_FAILURE = 'HASHTAG_SEARCH_FAILURE'


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
        draft.PostsData.unshift(action.data)
        break;
      case WRTIE_FAILURE:
        draft.wrtieLoading = false;
        draft.wrtieDone = true;
        draft.wrtieError = action.error;
        break;

      case LOAD_POSTS_REQUEST:
        draft.loadPostsLoading = true;
        draft.loadPostsDone = false;
        draft.loadPostsError = null;
        break;
      case LOAD_POSTS_SUCCESS:
        draft.loadPostsLoading = false;
        draft.loadPostsDone = true;
        draft.PostsData = draft.PostsData ? (draft.tagName ? action.data : draft.PostsData.concat(action.data)) : action.data;
        draft.InfinityScroll = action.data.length === 5 ? true : false;
        draft.tagName = '';
        break;
      case LOAD_POSTS_FAILURE:
        draft.loadPostsLoading = false;
        draft.loadPostsDone = true;
        draft.PostsData = [];
        draft.loadPostsError = action.error;
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


        case DELETE_POST_REQUEST:
          draft.deletePostLoading = true;
          draft.deletePostDone = false;
          draft.deletePostError = null;
          break;
        case DELETE_POST_SUCCESS:
          draft.deletePostLoading = false;
          draft.deletePostDone = true;
          draft.PostsData = draft.PostsData.filter(v => v.id !== action.data.PostId);
          break;
        case DELETE_POST_FAILURE:
          draft.deletePostLoading = false;
          draft.deletePostDone = true;
          draft.deletePostError = action.error;
          break;

          case HASHTAG_SEARCH_REQUEST:
            draft.hashtagSearchLoading = true;
            draft.hashtagSearchDone = false;
            draft.hashtagSearchError = null;
            break;
          case HASHTAG_SEARCH_SUCCESS:
            draft.hashtagSearchLoading = false;
            draft.hashtagSearchDone = true;
            draft.PostsData = (draft.tagName && (draft.tagName === action.tagName)) ? draft.PostsData.concat(action.data) : action.data;
            draft.InfinityScroll = action?.data?.length === 5 ? true : false;
            draft.tagName = action.tagName;
            draft.toggleTag = true;
            break;
            
          case HASHTAG_SEARCH_FAILURE:
            draft.hashtagSearchLoading = false;
            draft.hashtagSearchDone = true;
            draft.hashtagSearchError = action.error;
            break;

          case TOGGLE_TAG :
            draft.toggleTag = !draft.toggleTag;
            break;

      default:
        break;
    }
  });
};

export default reducer;
