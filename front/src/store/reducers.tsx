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
import * as _ from "lodash";

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
  const newConfigs = _.cloneDeep(state.configs);
  newConfigs.get(action.payload.metricId).remove(action.payload.restrictions);
  return { ...state, configs: newConfigs };
};

const reduceAddRestriction = (state: AppState, action: IRestrict): AppState => {
  const {
    metricId,
    restrictions,
    restrictedParam,
    restrictedToValue,
  } = action.payload;
  console.log(
    `RESTRICTING CHART! ${metricId} with ${restrictedParam}=${restrictedToValue}`
  );
  const newConfigs = _.cloneDeep(state.configs);
  const restrictionsSet = newConfigs.get(metricId);

  restrictionsSet.remove(restrictions);
  const newRestrictions = { ...restrictions };
  newRestrictions[restrictedParam] = restrictedToValue;
  restrictionsSet.add(newRestrictions);
  return { ...state, configs: newConfigs };
};

const reduceSplitBy = (state: AppState, action: ISplitBy): AppState => {
  const { metricId, variants, restrictions, param } = action.payload;
  console.log(
    `SPLITTING CHART  ${metricId}! Creating new chart for each variant of ${param}.`
  );
  const newConfigs = _.cloneDeep(state.configs);

  const restrictionsSet = newConfigs.get(metricId);
  restrictionsSet.remove(restrictions);
  // ^^ rm the original chart on which "split by" was clicked...
  // ...and add new versions supplied with one variant each
  variants.forEach((variant) => {
    const newRestrictions = { ...restrictions };
    newRestrictions[action.payload.param] = variant;
    restrictionsSet.add(newRestrictions);
  });

  return { ...state, configs: newConfigs };
};

const reduceFetchedPoints = (
  state: AppState,
  action: IFetchedPoints
): AppState => {
  // todo: if these points are already available don't fetch the data in the first place
  const { metricId, points } = action.payload;
  console.log(`FETCHED METRIC ${metricId}! Adding it's point's to state.`);

  const newConfigs = _.cloneDeep(state.configs);
  newConfigs.get(metricId).add({});

  const newCache = { ...state.cache };
  newCache[metricId] = points;

  return {
    configs: newConfigs,
    cache: newCache,
    last_message: state.last_message,
  };
};

const reduceFailedToFetchPoints = (
  state: AppState,
  action: IFailedToFetchPoints
): AppState => {
  const { metricId, msg } = action.payload;
  console.log(`FAILED TO FETCH POINTS FOR ${metricId}!!! msg: ${msg}`);
  return { ...state, last_message: msg };
};

const reducersByActionType = (() => {
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
  const reducer = reducersByActionType[action.type];
  if (!reducer) {
    // redux reserves right to dispatch some internal actions
    console.log(
      `Returning current state for unknown action type: ${action.type}`
    );
    return state;
  }
  return reducer(state, action);
};
