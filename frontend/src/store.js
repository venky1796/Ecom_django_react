import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { ProductDetailReducer, ProductListReducer, ProductDeleteReducer, ProductCreateReducer, ProductCreateReviewReducer, ProductTopReducer } from './reducers/productReducers'
import { cartReducer } from './reducers/cartReducer'
import { userDeleteReducer, userDetailsReducer, userListReducer, userloginReducer, userProfileUpdateReducer, userregisterReducer } from './reducers/userLoginReducers'
import { orderCreateReducer, orderDetailsReducer, orderListMyReducer, orderPayReducer } from './reducers/orderReducers'


const reducer = combineReducers({
    productList: ProductListReducer,
    productDetails: ProductDetailReducer,
    productDelete: ProductDeleteReducer,
    productCreate: ProductCreateReducer,
    productReviewCreate: ProductCreateReviewReducer,
    productTopRated: ProductTopReducer,
    cart: cartReducer,
    userLogin: userloginReducer,
    userRegister: userregisterReducer,
    userDetails: userDetailsReducer,
    userProfileUpdate: userProfileUpdateReducer,
    userList: userListReducer,
    userDelete: userDeleteReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    orderListMy: orderListMyReducer,
})

const cartItemsFromStorage = localStorage.getItem('cartItems') ?
    JSON.parse(localStorage.getItem('cartItems')) : []

const userInfoFromStorage = localStorage.getItem('userInfo') ?
    JSON.parse(localStorage.getItem('userInfo')) : null

const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ?
    JSON.parse(localStorage.getItem('shippingAddress')) : {}


const initialState = {
    cart: {
        cartItems: cartItemsFromStorage,
        shippingAddress: shippingAddressFromStorage
    },
    userLogin: { userInfo: userInfoFromStorage }
}

const middleware = [thunk]

const store = createStore(reducer, initialState,
    composeWithDevTools(applyMiddleware(...middleware)))



export default store;