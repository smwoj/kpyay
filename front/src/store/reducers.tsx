import { Action, Reducer } from "redux";
import { AppState, Restrictions } from "./models";
import {
  ActionTypes,
  IDeleteChart,
  ISplitBy,
  IRestrict,
  IFetchedPoints,
  IFailedToFetchPoints,
} from "./actions";
import * as mock_data from "../mock_data/data";
import { DefaultDict } from "../lib/collections/DefaultDict";
import { BFSet } from "../lib/collections/BFSet";

const INIT_STATE: AppState = {
  cache: {
    // "dogs-muffins f-score": mock_data.DOGS_VS_MUFFINS_FSCORES,
    alfa: mock_data.DOGS_VS_MUFFINS_FSCORES,
    beta: mock_data.SLOTHS_VS_PASTRY_FSCORES,
  },
  configs: new DefaultDict<BFSet<Restrictions>>(
    () => new BFSet<Restrictions>(),
    {
      // alfa: new BFSet([
      //   {},
      //   { team: "red" },
      //   { team: "green" },
      // ] as Restrictions[]),
      // beta: new BFSet([
      // { team: "echo" },
      // { classifier: "cnn-eta" },
      // ] as Restrictions[]),
      beta: new BFSet([{}]),
    }
  ),
  last_message: "", // todo: make it expire
};

const reduceInit = (state: AppState, action: Action): AppState => {
  console.log("!!! Using empty initial state. !!!");
  return INIT_STATE;
};

const reduceDeleteChart = (state: AppState, action: IDeleteChart): AppState => {
  console.log(
    `DELETING CHART ${
      action.payload.metricId
    } with restrictions ${JSON.stringify(action.payload.restrictions)}`
  );
  const newConfigs = state.configs.clone();
  newConfigs.get(action.payload.metricId).remove(action.payload.restrictions);
  return { ...state, configs: newConfigs };
};

const reduceAddRestriction = (state: AppState, action: IRestrict): AppState => {
  console.log(
    `RESTRICTING CHART! ${action.payload.metricId} with ${action.payload.restrictedParam}=${action.payload.restrictedToValue}`
  );
  const newConfigs = state.configs.clone();
  const restrictionsSet = newConfigs.get(action.payload.metricId);
  restrictionsSet.remove(action.payload.restrictions);
  const newRestrictions = { ...action.payload.restrictions };
  newRestrictions[action.payload.restrictedParam] =
    action.payload.restrictedToValue;
  restrictionsSet.add(newRestrictions);
  return { ...state, configs: newConfigs };
};
const reduceSplitBy = (state: AppState, action: ISplitBy): AppState => {
  console.log(
    `SPLITTING CHART  ${action.payload.metricId}! Creating new chart for each variant of ${action.payload.param}.`
  );
  const newConfigs = state.configs.clone();
  const restrictions = newConfigs.get(action.payload.metricId);
  restrictions.remove(action.payload.restrictions);
  action.payload.variants.forEach((variant) => {
    const newRestrictions = { ...action.payload.restrictions };
    newRestrictions[action.payload.param] = variant;
    restrictions.add(newRestrictions);
  });

  return { ...state, configs: newConfigs };
};
const reduceFetchedPoints = (
  state: AppState,
  action: IFetchedPoints
): AppState => {
  // todo nie feczuj jak już jest
  console.log(
    `FETCHED METRIC ${action.payload.metricId}! Adding it's point's to state.`
  );
  const updatedState = { ...state };
  updatedState.cache = { ...updatedState.cache };
  //  ^^^ avoid shallow copies interfering with re-rendering
  // TODO: sprawdź czy to serio problem i dlaczego
  updatedState.cache[action.payload.metricId] = action.payload.points;
  updatedState.configs.get(action.payload.metricId).add({});
  // ^ no restrictions, so all lines will be rendered
  return updatedState;
};

const reduceFailedToFetchPoints = (
  state: AppState,
  action: IFailedToFetchPoints
): AppState => {
  console.log(
    `FAILED TO FETCH POINTS FOR ${action.payload.metricId}!!! msg: ${action.payload.msg}`
  );
  return { ...state, last_message: action.payload.msg };
};

const reducers = (() => {
  const reducers: { [actionType: string]: Reducer } = {};
  reducers[ActionTypes.INIT_STORE] = reduceInit;
  reducers[ActionTypes.DELETE_CHART] = reduceDeleteChart;
  reducers[ActionTypes.ADD_RESTRICTION] = reduceAddRestriction;
  reducers[ActionTypes.SPLIT_BY] = reduceSplitBy;
  reducers[ActionTypes.FETCHED_POINTS] = reduceFetchedPoints;
  reducers[ActionTypes.FAILED_TO_FETCH_POINTS] = reduceFailedToFetchPoints;
  return reducers;
})();

export const rootReducer = (state: AppState, action: Action): AppState => {
  const reducer = reducers[action.type];
  if (!reducer) {
    console.log(
      `Returning current state for unknown action type: ${action.type}`
    );
    return state;
  }
  return reducer(state, action);
};
