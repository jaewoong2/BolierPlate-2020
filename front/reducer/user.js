import produce from 'immer'


const initialState = {
    loginLoading: false,
    loginDone: false,
    loginError: null,

    loginInfo : {},
}

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';


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
                draft.loginError = null;
                break;


            default:
                break;
        }
    })
}


export default reducer;