import { createStore, applyMiddleware, Dispatch, Action } from "redux";
import thunk from "redux-thunk";
import { initStoreAction } from "./actions";
import { rootReducer } from "./reducers";

export const initStore = () => {
  return (dispatch: Dispatch<Action>) => {
    return dispatch(initStoreAction());
  };
};

export const configureStore = () => {
  return createStore(rootReducer, applyMiddleware(thunk));
};
