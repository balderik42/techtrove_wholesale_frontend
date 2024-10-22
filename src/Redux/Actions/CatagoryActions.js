import axios from 'axios';
import * as actionTypes from '../Constants/CatagoryConstants'


const URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const listCategories = ()=>async (dispatch)=>{
try {
    dispatch({ type: actionTypes.GET_CATEGORY_REQUEST });
    const {data}= await axios.get(`${URL}/listcategories`)
    dispatch({ type: actionTypes.GET_CATEGORY_SUCCESS, payload: data })
}catch(error){
    dispatch({ type: actionTypes.GET_CATEGORY_FAIL, payload: error.message });
}
}