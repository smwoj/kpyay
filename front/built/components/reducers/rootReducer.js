import { combineReducers } from "redux";
import { todos } from "./todosReducer";
export var initState = {
    todos: [],
};
export var rootReducer = combineReducers({
    todos: todos,
});
//# sourceMappingURL=rootReducer.js.map