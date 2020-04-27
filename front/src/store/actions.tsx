import { Action } from "redux";
import { ChartSpec } from "./models";
import { Point } from "../models/Point";
import { BFSet } from "../lib/collections/BFSet";

export const ActionTypes = {
  INIT_STORE: "INIT_STORE",
  DELETE_CHART: "DELETE_CHART",
  ADD_RESTRICTION: "ADD_RESTRICTION",
  SPLIT_BY: "SPLIT_BY",
  FETCHED_POINTS: "FETCHED_POINTS",
  FAILED_TO_FETCH_POINTS: "FAILED_TO_FETCH_POINTS",
  SWITCH_X_AXIS: "SWITCH_X_AXIS",
  SHOW_MESSAGE: "SHOW_MESSAGE",
  SAVED_VIEW: "SAVED_VIEW",
  FAILED_TO_SAVE_VIEW: "FAILED_TO_SAVE_VIEW",
  FETCHED_CONFIG: "FETCHED_CONFIG",
  TOGGLE_CFG_BT_VISIBILITY: "TOGGLE_CFG_BT_VISIBILITY",
};

export interface IDeleteChart extends Action {
  payload: {
    spec: ChartSpec;
  };
}
export interface IRestrict extends Action {
  payload: {
    spec: ChartSpec;
    restrictedParam: string;
    restrictedToValue: string;
  };
}

export interface ISplitBy extends Action {
  payload: {
    spec: ChartSpec;
    param: string;
    variants: string[];
  };
}

export interface IFetchedPoints extends Action {
  payload: {
    metricId: string;
    points: Point[];
  };
}
export interface IFailedToFetchPoints extends Action {
  payload: {
    metricId: string;
    msg: string;
  };
}
export interface ISwitchXAxis extends Action {
  payload: {
    spec: ChartSpec;
  };
}
export interface ISavedView extends Action {
  payload: {
    viewName: string;
  };
}

export const savedViewAction = (viewName: string): ISavedView => {
  return {
    type: ActionTypes.SAVED_VIEW,
    payload: { viewName },
  };
};

export interface IFailedToSaveView extends Action {
  payload: {
    viewName: string;
    error: string;
  };
}
export const failedToSaveViewAction = (
  viewName: string,
  error: string
): IFailedToSaveView => {
  return {
    type: ActionTypes.FAILED_TO_SAVE_VIEW,
    payload: { viewName, error },
  };
};

export interface IShowMessage extends Action {
  payload: {
    message: string;
  };
}

export const showMessageAction = (message: string): IShowMessage => {
  return {
    type: ActionTypes.SHOW_MESSAGE,
    payload: { message },
  };
};

export const initStoreAction = (): Action => {
  return { type: ActionTypes.INIT_STORE };
};

export const deleteChartAction = (spec: ChartSpec): IDeleteChart => {
  return {
    type: ActionTypes.DELETE_CHART,
    payload: { spec },
  };
};

export const restrictAction = (
  spec: ChartSpec,
  restrictedParam: string,
  restrictedToValue: string
): IRestrict => {
  return {
    type: ActionTypes.ADD_RESTRICTION,
    payload: { spec, restrictedParam, restrictedToValue },
  };
};

export const splitByAction = (
  spec: ChartSpec,
  param: string,
  variants: string[]
): ISplitBy => {
  return {
    type: ActionTypes.SPLIT_BY,
    payload: { spec, param, variants },
  };
};

export const fetchedPointsAction = (
  metricId: string,
  points: Point[]
): IFetchedPoints => {
  return {
    type: ActionTypes.FETCHED_POINTS,
    payload: { metricId, points },
  };
};

export const failedToFetchPointsAction = (
  metricId: string,
  msg: string
): IFailedToFetchPoints => {
  return {
    type: ActionTypes.FAILED_TO_FETCH_POINTS,
    payload: { metricId, msg },
  };
};

export const switchXAxisAction = (spec: ChartSpec): ISwitchXAxis => {
  return {
    type: ActionTypes.SWITCH_X_AXIS,
    payload: {
      spec,
    },
  };
};

export interface ISetConfig extends Action {
  payload: {
    config: BFSet<ChartSpec>;
    viewName: string | null;
  };
}
export const setConfigAction = (
  viewName: string | null,
  config: BFSet<ChartSpec>
): ISetConfig => {
  return {
    type: ActionTypes.FETCHED_CONFIG,
    payload: {
      config,
      viewName,
    },
  };
};
export type IToggleCfgButtons = Action;

export const toggleCfgBtnVisibility = (): IToggleCfgButtons => {
  return {
    type: ActionTypes.TOGGLE_CFG_BT_VISIBILITY,
  };
};
