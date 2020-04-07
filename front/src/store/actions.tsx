import {Action} from "redux";

export const ActionTypes = {
    INIT_STORE: "INIT_STORE",
    DO_NOTHING: "DO_NOTHING",
};

export interface IInitStoreAction extends Action {
}

export interface IDoNothing extends Action {
}

export const initStoreAction = (): IInitStoreAction => {
    return {type: ActionTypes.INIT_STORE};
};

export const doNothingAction = (): IDoNothing => {
    return {type: ActionTypes.DO_NOTHING}
}
