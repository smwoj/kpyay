import { Action } from "redux";
import { Point } from "./models";

export const ActionTypes = {
  INIT_STORE: "INIT_STORE",
  DELETE_CHART: "DELETE_CHART",
  ADD_RESTRICTION: "ADD_RESTRICTION",
  SPLIT_BY: "SPLIT_BY",
  FETCHED_POINTS: "FETCHED_POINTS",
  FAILED_TO_FETCH_POINTS: "FAILED_TO_FETCH_POINTS",
};

export interface IInitStoreAction extends Action {}

export interface IDeleteChart extends Action {
  payload: {
    chartId: string;
  };
}
export interface IRestrict extends Action {
  payload: {
    chartId: string;
    restriction: string;
  };
}

export interface ISplitBy extends Action {
  payload: {
    chartId: string;
    param: string;
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

export const initStoreAction = (): IInitStoreAction => {
  return { type: ActionTypes.INIT_STORE };
};

export const deleteChartAction = (chartId: string): IDeleteChart => {
  return { type: ActionTypes.DELETE_CHART, payload: { chartId } };
};

export const addRestrictionAction = (
  chartId: string,
  restriction: string
): IRestrict => {
  return {
    type: ActionTypes.ADD_RESTRICTION,
    payload: { chartId, restriction },
  };
};

export const splitByAction = (chartId: string, param: string): ISplitBy => {
  return {
    type: ActionTypes.SPLIT_BY,
    payload: { chartId, param },
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
