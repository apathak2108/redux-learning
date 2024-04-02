import axios from "axios";
import { applyMiddleware, createStore } from "redux";
import { thunk } from "redux-thunk";


const initialState = {
    loading: false,
    users: [],
    error: ""
}

const FETCH_USER_REQUEST = "FETCH_USER_REQUEST";
const FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS";
const FETCH_USER_FAILURE = "FETCH_USER_FAILURE";

const fetchUserRequest = () => {
    return {
        type: FETCH_USER_REQUEST
    }
}
const fetchUserSuccess = (users) => {
    return {
        type: FETCH_USER_SUCCESS,
        payload: users
    }
}
const fetchUserFailure = (error) => {
    return {
        type: FETCH_USER_FAILURE,
        payload: error
    }
}

const reducer = (state=initialState, action) => {
    switch(action.type) {
        case FETCH_USER_REQUEST:
            return {
                ...state,
                loading:true
            }
        case FETCH_USER_SUCCESS:
            return {
                ...state,
                loading:false,
                users: action.payload,
                error: ""
            }
        case FETCH_USER_FAILURE:
            return {
                ...state,
                loading: false,
                users: [],
                error: action.payload
            }
        default:
            return state;
    }
}

const fetchUsers = () => {
    return function(dispatch) {
        dispatch(fetchUserRequest());
        axios.get("https://jsonplaceholder.typicode.com/users")
        .then((res) => {
            const users = res.data.map(user => user.id);
            dispatch(fetchUserSuccess(users));
        })
        .catch((err) => {
            dispatch(fetchUserFailure(err))
        })
    }
}

const store = createStore(reducer, applyMiddleware(thunk));
store.subscribe(() => console.log(store.getState()));
store.dispatch(fetchUsers());
