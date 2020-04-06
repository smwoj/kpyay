import { ActionTypes } from "./actionTypes";
export var initStoreAction = function (todos) {
    return { type: ActionTypes.INIT_STORE, todos: todos };
};
export var addTodoAction = function (todo) {
    return { type: ActionTypes.ADD_TODO_ITEM, todo: todo };
};
export var completeTodoAction = function (todo) {
    return { type: ActionTypes.COMPLETE_TODO_ITEM, todo: todo };
};
export var actionCreators = {
    addTodoAction: addTodoAction,
    completeTodoAction: completeTodoAction,
};
//# sourceMappingURL=actions.js.map