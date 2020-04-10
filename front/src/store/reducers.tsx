import {Action} from "redux";
import {AppState} from "./models";
import {ActionTypes} from './actions'
import * as mock_data from '../mock_data/data'

const MOCK_INIT_STATE = {
    chartsData: {
        'sloths-pastry f-score': mock_data.SLOTHS_VS_PASTRY_FSCORES,
        'dogs-muffins f-score': mock_data.DOGS_VS_MUFFINS_FSCORES,
    }
};
// const PROD_INIT_STATE = {
//     chartsData: {}
// };


export const rootReducer = (
    state: AppState,
    action: Action,
): AppState => {
    switch (action.type) {
        case ActionTypes.INIT_STORE:
            // if (process.env.USE_MOCK_DATA) {
                // TODO handle it more gracefully so these dumps aren't included in prod build
                console.log("WARNING: Using mock initial state!");
                return MOCK_INIT_STATE;
            // } else {
                // console.log("WARNING: Using PROD STATE!");
                // return PROD_INIT_STATE;
            // }
        default:
            return state;
    }
};
