import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { productDetailsReducer, productListReducer } from './Reducers/ProductReducer';
import { categoryListReducer } from './Reducers/CatagoryReducer';

const reducer = combineReducers({
    productList: productListReducer,
    productDetails:productDetailsReducer,
    categoryList: categoryListReducer // Add reducer to combineReducers
});


const initialState = {};
const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;