import { Action } from "redux";
import { Point, Restrictions } from "./models";

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
    metricId: string;
    restrictions: Restrictions;
  };
}
export interface IRestrict extends Action {
  payload: {
    metricId: string;
    restrictions: Restrictions;
    restrictedParam: string;
    restrictedToValue: string;
  };
}

export interface ISplitBy extends Action {
  payload: {
    metricId: string;
    restrictions: Restrictions;
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

export const initStoreAction = (): IInitStoreAction => {
  return { type: ActionTypes.INIT_STORE };
};

export const deleteChartAction = (
  metricId: string,
  restrictions: Restrictions
): IDeleteChart => {
  return {
    type: ActionTypes.DELETE_CHART,
    payload: { metricId, restrictions },
  };
};

export const restrictAction = (
  metricId: string,
  restrictions: Restrictions,
  restrictedParam: string,
  restrictedToValue: string
): IRestrict => {
  return {
    type: ActionTypes.ADD_RESTRICTION,
    payload: { metricId, restrictions, restrictedParam, restrictedToValue },
  };
};

export const splitByAction = (
  metricId: string,
  restrictions: Restrictions,
  param: string,
  variants: string[]
): ISplitBy => {
  return {
    type: ActionTypes.SPLIT_BY,
    payload: { metricId, restrictions, param, variants },
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
