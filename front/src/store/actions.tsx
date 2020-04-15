import { Action } from "redux";
import { Point } from "./models";
import * as mock_data from "../mock_data/data";

export const ActionTypes = {
  INIT_STORE: "INIT_STORE",
  DELETE_CHART: "DELETE_CHART",
  ADD_RESTRICTION: "ADD_RESTRICTION",
  SPLIT_BY: "SPLIT_BY",
  FETCH_DATA: "FETCH_DATA",
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

export interface IFetchMetric extends Action {
  payload: {
    metricId: string;
    points: Point[];
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

const MOCK_DATA: { [metricId: string]: Point[] } = {
  "sloths-pastry f-score": mock_data.SLOTHS_VS_PASTRY_FSCORES,
  beta: mock_data.DOGS_VS_MUFFINS_FSCORES,
  gamma: mock_data.SLOTHS_VS_PASTRY_FSCORES,
  delta: mock_data.SLOTHS_VS_PASTRY_FSCORES,
  "dogs-muffins f-score": mock_data.DOGS_VS_MUFFINS_FSCORES,
};

export const fetchMetricAction = (metricId: string): IFetchMetric => {
  const points = MOCK_DATA[metricId];
  if (points === undefined) {
    console.log("bad stuff happened, can't fetch data for " + metricId);
    throw `no such metric: ${metricId} || weź to obsłuż jak człowiek`;
  }
  return {
    type: ActionTypes.FETCH_DATA,
    payload: { metricId, points },
  };
};
