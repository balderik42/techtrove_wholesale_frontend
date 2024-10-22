import * as actionTypes from '../Constants/ProductConstants';

const initialState = {
  loading: true,  // Initially, set loading to true when fetching details
  product: {},    // Product is an empty object initially
  error: null,    // No error initially
};

export const productListReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case actionTypes.PRODUCT_LIST_REQUEST:
      return { loading: true, products: [] };
    case actionTypes.PRODUCT_LIST_SUCCESS:
      return { loading: false, products: action.payload };
    case actionTypes.PRODUCT_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
export const productDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_PRODUCT_DETAILS_REQUEST:
      return { ...state, loading: true };
    case actionTypes.GET_PRODUCT_DETAILS_SUCCESS:
      return { loading: false, product: action.payload };
    case actionTypes.GET_PRODUCT_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};