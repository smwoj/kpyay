import { initState } from "./rootReducer";
import * as todoActions from "../actions/actionTypes";
export var todos = function (state, action) {
    if (state === void 0) { state = initState.todos; }
    switch (action.type) {
        case todoActions.ActionTypes.INIT_STORE:
            return action.todos;
        case todoActions.ActionTypes.ADD_TODO_ITEM: {
            var todoItems = state.slice();
            var todo = action.todo;
            todo.id = todoItems.length;
            todo.key = todoItems.length;
            todo.isCompleted = false;
            todoItems.push(todo);
            return todoItems;
        }
        case todoActions.ActionTypes.COMPLETE_TODO_ITEM: {
            var todoItems = state.slice();
            var todo = action.todo;
            for (var _i = 0, todoItems_1 = todoItems; _i < todoItems_1.length; _i++) {
                var item = todoItems_1[_i];
                if (item.id === todo.id) {
                    item.isCompleted = true;
                    break;
                }
            }
            return todoItems;
        }
        default:
            return state;
    }
};
//# sourceMappingURL=todosReducer.js.map