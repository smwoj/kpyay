import {createStore, applyMiddleware, Dispatch, Action} from "redux";
// import {composeWithDevTools} from "redux-devtools-extension/developmentOnly";
import thunk from "redux-thunk";
import {initStoreAction} from "./actions";
import {rootReducer} from './reducers'

export const initStore = () => {
    return (dispatch: Dispatch<Action>) => {
        return dispatch(initStoreAction());
    };
};

export const configureStore = () => {
    return createStore(rootReducer, applyMiddleware(thunk));
    // if (process.env.NODE_ENV === "production") {
    //     return createStore(
    //         rootReducer,
    //         applyMiddleware(thunk),
    //     );
    // } else {
    //     return createStore(
    //         rootReducer,
    //         composeWithDevTools(
    //             applyMiddleware(thunk),
    //         ),
    //     );
    // }
};
