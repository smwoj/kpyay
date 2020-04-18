import { Action } from "redux";
import { AppState } from "./models";
import {
  ActionTypes,
  IDeleteChart,
  ISplitBy,
  IRestrict,
  IFetchedPoints,
  IFailedToFetchPoints,
} from "./actions";
import * as mock_data from "../mock_data/data";

const INIT_STATE: AppState = {
  cache: {
    // "dogs-muffins f-score": mock_data.DOGS_VS_MUFFINS_FSCORES,
    alfa: mock_data.DOGS_VS_MUFFINS_FSCORES,
    beta: mock_data.SLOTHS_VS_PASTRY_FSCORES,
  },
  configs: {
    alfa: [{}, { team: "red" }, { team: "green" }],
    beta: [{ team: "echo" }, { classifier: "cnn-eta" }],
  },
  last_message: "", // todo: make it expire
};

export const rootReducer = (state: AppState, action: Action): AppState => {
  let act;
  console.log("Reducer odpalony", action);

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

    case ActionTypes.FETCHED_POINTS:
      // todo nie feczuj jak już jest
      act = action as IFetchedPoints;
      console.log(
        `FETCHED METRIC ${act.payload.metricId}! Adding it's point's to state.`
      );
      let updatedState = { ...state };
      updatedState.cache = { ...updatedState.cache };
      //  ^^^ avoid shallow copies interfering with re-rendering
      // TODO: sprawdź czy to serio problem i dlaczego
      updatedState.cache[act.payload.metricId] = act.payload.points;
      // dodać config łajzo todo
      return updatedState;

    case ActionTypes.FAILED_TO_FETCH_POINTS:
      act = action as IFailedToFetchPoints;
      console.log(
        `FAILED TO FETCH POINTS FOR ${act.payload.metricId}!!! msg: ${act.payload.msg}`
      );
      return { ...state, last_message: act.payload.msg };

    default:
      return state;
  }
};
