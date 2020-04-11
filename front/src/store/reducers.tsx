import { Action } from "redux";
import { AppState } from "./models";
import {
  ActionTypes,
  IDeleteChart,
  ISplitBy,
  IRestrict,
  IFetchMetric,
} from "./actions";

const INIT_STATE = {
  chartsData: {},
};

export const rootReducer = (state: AppState, action: Action): AppState => {
  let act;

  switch (action.type) {
    case ActionTypes.INIT_STORE:
      console.log("!!! Using empty initial state. !!!");
      return INIT_STATE;

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

    case ActionTypes.SPLIT_BY:
      act = action as ISplitBy;
      console.log(
        `SPLITTING CHART  ${act.payload.chartId}! Creating new chart for each variant of ${act.payload.param}.`
      );
      return { ...state }; // TODO

    case ActionTypes.FETCH_DATA:
      act = action as IFetchMetric;
      console.log(
        `FETCHED METRIC ${act.payload.metricId}! Adding it's point's to state.`
      );
      let updatedState = { ...state };
      updatedState.chartsData[act.payload.metricId] = act.payload.points;
      return updatedState;

    default:
      return state;
  }
};
