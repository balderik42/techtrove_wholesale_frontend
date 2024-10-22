import * as actionType from '../Constants/CatagoryConstants'

export const categoryListReducer = (state = { categories: [] }, action) => {
    switch (action.type) {
        case actionType.GET_CATEGORY_REQUEST:
            return { loading: true, categories: [] };
        case actionType.GET_CATEGORY_SUCCESS:
            return { loading: false, categories: action.payload };
        case actionType.GET_CATEGORY_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};