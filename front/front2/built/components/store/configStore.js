import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import thunk from "redux-thunk";
import { initStoreAction } from "../actions/actions";
import { rootReducer } from "../reducers/rootReducer";
export var initStore = function () {
    return function (dispatch) {
        var todos = [{
                key: 0,
                id: 0,
                name: "Create a template for react and typescript.",
                isCompleted: true,
            }, {
                key: 1,
                id: 1,
                name: "Wire up redux to the template.",
                isCompleted: false,
            }];
        return dispatch(initStoreAction(todos));
    };
};
export var configureStore = function () {
    if (process.env.NODE_ENV === "production") {
        return createStore(rootReducer, applyMiddleware(thunk));
    }
    else {
        return createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
    }
};
//# sourceMappingURL=configStore.js.map