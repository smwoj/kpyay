import { Action, Reducer } from "redux";
import { AppState } from "./models";
import {
  ActionTypes,
  IDeleteChart,
  ISplitBy,
  IRestrict,
  IFetchedPoints,
  IFailedToFetchPoints,
  ISwitchXAxis,
  ISavedView,
  IShowMessage,
  IFailedToSaveView,
  ISetConfig,
  IToggleCfgButtons,
} from "./actions";
import { BFSet } from "../lib/collections/BFSet";
import * as _ from "lodash";
import stringify from "json-stable-stringify";

const INIT_STATE: AppState = {
  viewName: null,
  showConfigButtons: true,
  cache: {},
  configs: new BFSet([]),
  lastMessage: null,
};

const reduceInit = (state: AppState, action: Action): AppState => {
  console.log("!!! Using empty initial state. !!!");
  return INIT_STATE;
};

const reduceDeleteChart = (state: AppState, action: IDeleteChart): AppState => {
  const { spec } = action.payload;
  console.log(`DELETING CHART ${spec.metricId} with spec ${stringify(spec)}`);

  const newConfigs = _.cloneDeep(state.configs);
  newConfigs.remove(spec);
  return { ...state, configs: newConfigs };
};

const reduceAddRestriction = (state: AppState, action: IRestrict): AppState => {
  const { spec, restrictedParam, restrictedToValue } = action.payload;
  console.log(
    `RESTRICTING CHART! ${spec.metricId}, spec: ${stringify(
      spec
    )} with ${restrictedParam}=${restrictedToValue}`
  );
  const specsSet = _.cloneDeep(state.configs);

  specsSet.remove(spec);
  const newSpec = _.cloneDeep(spec);
  newSpec.restrictions[restrictedParam] = restrictedToValue;
  specsSet.add(newSpec);

  return { ...state, configs: specsSet };
};

const reduceSplitBy = (state: AppState, action: ISplitBy): AppState => {
  const { variants, spec, param } = action.payload;
  console.log(
    `SPLITTING CHART  ${spec.metricId}! Creating new chart for each variant of ${param}.`
  );
  const newSpecs = _.cloneDeep(state.configs);

  newSpecs.remove(spec);
  // ^^ rm the original chart on which "split by" was clicked...
  // ...and add new versions supplied with one variant each
  variants.forEach((variant) => {
    const newSpec = _.cloneDeep(spec);
    newSpec.restrictions[param] = variant;
    newSpecs.add(newSpec);
  });

  return { ...state, configs: newSpecs };
};

const reduceFetchedPoints = (
  state: AppState,
  action: IFetchedPoints
): AppState => {
  // todo: if these points are already available don't fetch the data in the first place
  const { metricId, points } = action.payload;
  console.log(`FETCHED METRIC ${metricId}! Adding it's point's to state.`);

  const newConfigs = _.cloneDeep(state.configs);
  newConfigs.add({ metricId, xAccessor: "timestamp", restrictions: {} });

  const newCache = { ...state.cache };
  newCache[metricId] = points;

  return {
    ...state,
    configs: newConfigs,
    cache: newCache,
  };
};

const reduceFailedToFetchPoints = (
  state: AppState,
  action: IFailedToFetchPoints
): AppState => {
  const { metricId, msg } = action.payload;
  console.log(`FAILED TO FETCH POINTS FOR ${metricId}!!! msg: ${msg}`);
  return {
    ...state,
    lastMessage: { message: msg, messageTimestamp: Date.now() },
  };
};

const reduceSwitchXAxis = (state: AppState, action: ISwitchXAxis): AppState => {
  const { spec } = action.payload;
  console.log(`Switching accessor for spec ${stringify(spec)}`);

  const newConfigs = _.cloneDeep(state.configs);
  newConfigs.remove(spec);

  const newSpec = _.cloneDeep(spec);
  newSpec.xAccessor = "timestamp" === spec.xAccessor ? "version" : "timestamp";
  newConfigs.add(newSpec);

  return { ...state, configs: newConfigs };
};
// TODO: lots of these reducers can be removed and replaced with simply showMessage

const reduceSavedView = (state: AppState, action: ISavedView): AppState => {
  const { viewName } = action.payload;
  const message = `Saved view: '${viewName}'`;
  console.log(message);
  return {
    ...state,
    viewName,
    lastMessage: { message, messageTimestamp: Date.now() },
  };
};

const reduceShowMessage = (state: AppState, action: IShowMessage): AppState => {
  const { message, messageTimestamp } = action.payload;
  console.log(`Showing message: ${message}`);
  return { ...state, lastMessage: { message, messageTimestamp } };
};

const reduceFailedToSaveView = (
  state: AppState,
  action: IFailedToSaveView
): AppState => {
  const { error, viewName } = action.payload;
  const msg = `Couldn't save view '${viewName}'. Error: ${error}`;
  console.log(msg);
  return {
    ...state,
    lastMessage: { message: msg, messageTimestamp: Date.now() },
  };
};
const reduceFetchedConfig = (state: AppState, action: ISetConfig): AppState => {
  const { config, viewName } = action.payload;
  const view = viewName ? `view ${viewName}` : "empty view";
  const msg = `Setting fetched config for ${view}: ${stringify(config)}`;
  console.log(msg);
  return {
    ...state,
    viewName,
    configs: config,
    lastMessage: viewName ? {message: `Loaded config '${viewName}'.`, messageTimestamp: Date.now()}: null,
  };
};
const reduceToggleCfgBtnVisibility = (
  state: AppState,
  action: IToggleCfgButtons
): AppState => {
  console.log(`Switching visibility of config buttons.`);
  return {
    ...state,
    showConfigButtons: !state.showConfigButtons,
  };
};

const reducersByActionType = (() => {
  const reducers: { [actionType: string]: Reducer } = {};
  reducers[ActionTypes.INIT_STORE] = reduceInit;
  reducers[ActionTypes.DELETE_CHART] = reduceDeleteChart;
  reducers[ActionTypes.ADD_RESTRICTION] = reduceAddRestriction;
  reducers[ActionTypes.SPLIT_BY] = reduceSplitBy;
  reducers[ActionTypes.FETCHED_POINTS] = reduceFetchedPoints;
  reducers[ActionTypes.FAILED_TO_FETCH_POINTS] = reduceFailedToFetchPoints;
  reducers[ActionTypes.SWITCH_X_AXIS] = reduceSwitchXAxis;
  reducers[ActionTypes.SAVED_VIEW] = reduceSavedView;
  reducers[ActionTypes.FAILED_TO_SAVE_VIEW] = reduceFailedToSaveView;
  reducers[ActionTypes.SHOW_MESSAGE] = reduceShowMessage;
  reducers[ActionTypes.FETCHED_CONFIG] = reduceFetchedConfig;
  reducers[ActionTypes.TOGGLE_CFG_BT_VISIBILITY] = reduceToggleCfgBtnVisibility;
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
