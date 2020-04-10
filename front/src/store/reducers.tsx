import { Action } from "redux";
import { AppState } from "./models";
import { ActionTypes, IDeleteChart, IGroupBy, IRestrict } from "./actions";
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
      console.log(`HIDING CHART ${act.payload.chartId}`);
      return { ...state }; // TODO

    case ActionTypes.ADD_RESTRICTION:
      act = action as IRestrict;
      console.log(
        `RESTRICTING CHART! ${act.payload.chartId} with ${act.payload.restriction}`
      );
      return { ...state }; // TODO

    case ActionTypes.GROUP_BY:
      act = action as IGroupBy;
      console.log(
        `SPLITTING CHART  ${act.payload.chartId}! Creating new chart for each variant of ${act.payload.param}.`
      );
      return { ...state }; // TODO

    default:
      return state;
  }
};
