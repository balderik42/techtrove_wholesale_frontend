import axios from 'axios';
import * as actionTypes from '../Constants/ProductConstants';
const URL =  process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const listProductsByCategory = (category) => async (dispatch) => {
  try {
    dispatch({ type:actionTypes.PRODUCT_LIST_REQUEST });

    const { data } = await axios.get(`${URL}/products/category?category=${category}`);
    
    dispatch({ type: actionTypes.PRODUCT_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: actionTypes.PRODUCT_LIST_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};


export const getProductDetails = (productId) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.GET_PRODUCT_DETAILS_REQUEST });

    const { data } = await axios.get(`${URL}/products/${productId}`);
    dispatch({
      type: actionTypes.GET_PRODUCT_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: actionTypes.GET_PRODUCT_DETAILS_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};