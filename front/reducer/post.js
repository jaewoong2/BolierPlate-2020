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

  deletePostLoading: false,
  deletePostDone: false,
  deletePostError: null,

  hashtagSearchLoading: false,
  hashtagSearchDone: false,
  hashtagSearchError: null,

  submitCommentLoading : false,
  submitCommentDone : false,
  submitCommentError : null,
  
  deleteCommentLoading : false,
  deleteCommentDone : false,
  deleteCommentError : null,
  
  PageNation: false,
  toggleTag: false,
  InfinityScroll: true,

  CoverUserId : null,
  CoverUp : false,
  CoverUpLoading : false,
  
  tagName: "",
  ImagePaths: [],
  PostsData: [],
  onePost: {},
  RecommentInfo : {},
};
export const COVER_POST = 'COVER_POST';
export const TOGGLE_TAG = "TOGGLE_TAG";
export const PAGE_NATION_TOGGLE = "PAGE_NATION_TOGGLE";
export const RECOMMENT_TOGGLE = 'RECOMMENT_TOGGLE';

export const WRTIE_REQUEST = "WRTIE_REQUEST";
export const WRTIE_SUCCESS = "WRTIE_SUCCESS";
export const WRTIE_FAILURE = "WRTIE_FAILURE";

export const LOAD_POSTS_REQUEST = "LOAD_POSTS_REQUEST";
export const LOAD_POSTS_SUCCESS = "LOAD_POSTS_SUCCESS";
export const LOAD_POSTS_FAILURE = "LOAD_POSTS_FAILURE";

export const LOAD_ONE_POST_REQUEST = "LOAD_ONE_POST_REQUEST";
export const LOAD_ONE_POST_SUCCESS = "LOAD_ONE_POST_SUCCESS";
export const LOAD_ONE_POST_FAILURE = "LOAD_ONE_POST_FAILURE";

export const UPLOAD_IMAGES_SUCCESS = "UPLOAD_IMAGES_SUCCESS";
export const UPLOAD_IMAGES_FAILURE = "UPLOAD_IMAGES_FAILURE";
export const UPLOAD_IMAGES_REQUEST = "UPLOAD_IMAGES_REQUEST";

export const DELETE_POST_REQUEST = "DELETE_POST_REQUEST";
export const DELETE_POST_SUCCESS = "DELETE_POST_SUCCESS";
export const DELETE_POST_FAILURE = "DELETE_POST_FAILURE";

export const HASHTAG_SEARCH_REQUEST = "HASHTAG_SEARCH_REQUEST";
export const HASHTAG_SEARCH_SUCCESS = "HASHTAG_SEARCH_SUCCESS";
export const HASHTAG_SEARCH_FAILURE = "HASHTAG_SEARCH_FAILURE";

export const SUBMIT_COMMENT_REQUEST = "SUBMIT_COMMENT_REQUEST";
export const SUBMIT_COMMENT_SUCCESS = "SUBMIT_COMMENT_SUCCESS";
export const SUBMIT_COMMENT_FAILURE = "SUBMIT_COMMENT_FAILURE";

export const DELETE_COMMENT_REQUEST = "DELETE_COMMENT_REQUEST";
export const DELETE_COMMENT_SUCCESS = "DELETE_COMMENT_SUCCESS";
export const DELETE_COMMENT_FAILURE = "DELETE_COMMENT_FAILURE";

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
        action.edit ? 
        draft.PostsData.map(v => v.id === action.data.id ? action.data : v)
        : draft.PostsData.unshift(action.data);
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
        draft.PostsData = draft.PageNation // 페이지 넘김 
          ? action.data // 페이지를 넘기기가 가능하면 다음 
          : draft.PostsData
          ? draft.tagName
            ? action.data
            : draft.PostsData.concat(action.data)
          : action.data;
        draft.InfinityScroll = draft.PageNation
          ? false
          : action.data.length === 5
          ? true
          : false;
        draft.tagName = "";
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
        draft.PostsData = draft.PostsData.filter(
          (v) => v.id !== action.data.PostId
        );
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
        draft.PostsData = draft.PageNation
          ? action.data
          : draft.tagName && draft.tagName === action.tagName
          ? draft.PostsData.concat(action.data)
          : action.data;
        draft.InfinityScroll = action?.data?.length === 5 ? true : false;
        draft.tagName = action.tagName;
        draft.toggleTag = true;
        break;

      case HASHTAG_SEARCH_FAILURE:
        draft.hashtagSearchLoading = false;
        draft.hashtagSearchDone = true;
        draft.hashtagSearchError = action.error;
        break;

        case SUBMIT_COMMENT_REQUEST:
          draft.submitCommentLoading = true;
          draft.submitCommentDone = false;
          draft.submitCommentFailure = null;
          break;
        case SUBMIT_COMMENT_SUCCESS:
          draft.submitCommentLoading = false;
          draft.submitCommentDone = true;
          break;
        case SUBMIT_COMMENT_FAILURE:
          draft.submitCommentLoading = false;
          draft.submitCommentDone = true;
          draft.submitCommentFailure = action.error;
          break;
  
          
      case LOAD_ONE_POST_REQUEST:
        draft.loadPostsLoading = true;
        draft.loadPostsDone = false;
        draft.loadPostsFailure = null;
        break;

      case LOAD_ONE_POST_SUCCESS:
        draft.loadPostsLoading = false;
        draft.loadPostsDone = true;
        draft.onePost = action.data;
        break;

      case LOAD_ONE_POST_SUCCESS:
        draft.loadPostsLoading = false;
        draft.loadPostsDone = true;
        draft.loadPostsFailure = action.error;
        break;

        case DELETE_COMMENT_REQUEST:
          draft.deleteCommentLoading = true;
          draft.deleteCommentDone = false;
          draft.deleteCommentFailure = null;
          break;
        case DELETE_COMMENT_SUCCESS:
          draft.deleteCommentLoading = false;
          draft.deleteCommentDone = true;
          break;
        case DELETE_COMMENT_FAILURE:
          draft.deleteCommentLoading = false;
          draft.deleteCommentDone = true;
          draft.deleteCommentFailure = action.error;
          break;
  







        
      case TOGGLE_TAG:
        draft.toggleTag = !draft.toggleTag;
        break;

      case PAGE_NATION_TOGGLE:
        draft.PageNation = !draft.PageNation;
        draft.InfinityScroll = !draft.PageNation;
        break;
        
        case COVER_POST : 
        draft.CoverUpLoading = true;
        draft.CoverUserId = action.id;
        draft.CoverUp = !draft.CoverUp;
        break;
        case 'COVER_POST_SUCCESS' : 
        draft.CoverUpLoading = false;
        break;

      case RECOMMENT_TOGGLE : 
        draft.RecommentInfo = action.data.comment;
        default:
          break;
    }
  });
};

export default reducer;
