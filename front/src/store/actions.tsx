import { Action } from "redux";
import { ChartSpec } from "./models";
import { Point } from "../models/Point";

export const ActionTypes = {
  INIT_STORE: "INIT_STORE",
  DELETE_CHART: "DELETE_CHART",
  ADD_RESTRICTION: "ADD_RESTRICTION",
  SPLIT_BY: "SPLIT_BY",
  FETCHED_POINTS: "FETCHED_POINTS",
  FAILED_TO_FETCH_POINTS: "FAILED_TO_FETCH_POINTS",
  SWITCH_X_AXIS: "SWITCH_X_AXIS",
};

export interface IDeleteChart extends Action {
  payload: {
    metricId: string;
    spec: ChartSpec;
  };
}
export interface IRestrict extends Action {
  payload: {
    metricId: string;
    spec: ChartSpec;
    restrictedParam: string;
    restrictedToValue: string;
  };
}

export interface ISplitBy extends Action {
  payload: {
    metricId: string;
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
    metricId: string;
    spec: ChartSpec;
  };
}

export const initStoreAction = (): Action => {
  return { type: ActionTypes.INIT_STORE };
};

export const deleteChartAction = (
  metricId: string,
  spec: ChartSpec
): IDeleteChart => {
  return {
    type: ActionTypes.DELETE_CHART,
    payload: { metricId, spec: spec },
  };
};

export const restrictAction = (
  metricId: string,
  spec: ChartSpec,
  restrictedParam: string,
  restrictedToValue: string
): IRestrict => {
  return {
    type: ActionTypes.ADD_RESTRICTION,
    payload: { metricId, spec: spec, restrictedParam, restrictedToValue },
  };
};

export const splitByAction = (
  metricId: string,
  spec: ChartSpec,
  param: string,
  variants: string[]
): ISplitBy => {
  return {
    type: ActionTypes.SPLIT_BY,
    payload: { metricId, spec, param, variants },
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

export const switchXAxisAction = (
  metricId: string,
  spec: ChartSpec
): ISwitchXAxis => {
  return {
    type: ActionTypes.SWITCH_X_AXIS,
    payload: {
      metricId,
      spec,
    },
  };
};
