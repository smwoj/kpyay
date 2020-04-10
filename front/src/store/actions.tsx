import { Action } from "redux";

export const ActionTypes = {
  INIT_STORE: "INIT_STORE",
  DELETE_CHART: "DELETE_CHART",
  ADD_RESTRICTION: "ADD_RESTRICTION",
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
