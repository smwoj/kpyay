import { Action } from "redux";
import { AppState } from "./models";
import { ActionTypes, IDeleteChart, IRestrict } from "./actions";
import * as mock_data from "../mock_data/data";

const MOCK_INIT_STATE = {
  chartsData: {
    "sloths-pastry f-score": mock_data.SLOTHS_VS_PASTRY_FSCORES,
    "dogs-muffins f-score": mock_data.DOGS_VS_MUFFINS_FSCORES,
  },
};

export const rootReducer = (state: AppState, action: Action): AppState => {
  let act;

  switch (action.type) {
    case ActionTypes.INIT_STORE:
      console.log("!!! Using mock initial state !!!");
      return MOCK_INIT_STATE;

    case ActionTypes.DELETE_CHART:
      act = action as IDeleteChart;
      console.log(`TODO: CHART DELETION! ${act.payload.chartId}`);
      return { ...state };

    case ActionTypes.ADD_RESTRICTION:
      act = action as IRestrict;
      console.log(
        `TODO: RESTRICTING CHART! ${act.payload.chartId} with ${act.payload.restriction}`
      );
      return { ...state };

    default:
      return state;
  }
};
