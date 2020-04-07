import {Action} from "redux";
import {AppState} from "./models";
import {ActionTypes} from './actions'

const INIT_STATE: AppState = {
    chartsData: {}
};

export const rootReducer = (
    state: AppState,
    action: Action,
): AppState => {
    switch (action.type) {
        case ActionTypes.INIT_STORE:
            return INIT_STATE;
        // case todoActions.ActionTypes.COMPLETE_TODO_ITEM: {
        //     const todoItems = state.slice();
        //     const todo = (action as todoActions.ICompleteTodoAction).todo;
        //     for (const item of todoItems) {
        //         if (item.id === todo.id) {
        //             item.isCompleted = true;
        //             break;
        //         }
        //     }
        //     return todoItems;
        // }
        default:
            return state;
    }
};
