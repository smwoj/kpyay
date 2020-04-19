import { Action } from "redux";
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
import { BFSet, DefaultDict } from "../lib/collections";

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

// todo: podziel i zrób mapę
export const rootReducer = (state: AppState, action: Action): AppState => {
  let act, newConfigs;
  console.log("Reducer odpalony", action);

  switch (action.type) {
    case ActionTypes.INIT_STORE:
      console.log("!!! Using empty initial state. !!!");
      return INIT_STATE;

    case ActionTypes.DELETE_CHART:
      act = action as IDeleteChart;
      console.log(
        `DELETING CHART ${
          act.payload.metricId
        } with restrictions ${JSON.stringify(act.payload.restrictions)}`
      );
      newConfigs = state.configs.clone();
      newConfigs.get(act.payload.metricId).remove(act.payload.restrictions);
      return { ...state, configs: newConfigs };

    case ActionTypes.ADD_RESTRICTION:
      act = action as IRestrict;
      console.log(
        `RESTRICTING CHART! ${act.payload.metricId} with ${act.payload.restrictedParam}=${act.payload.restrictedToValue}`
      );
      newConfigs = state.configs.clone();
      let restrictionsSet = newConfigs.get(act.payload.metricId);
      restrictionsSet.remove(act.payload.restrictions);
      let newRestrictions = { ...act.payload.restrictions };
      newRestrictions[act.payload.restrictedParam] =
        act.payload.restrictedToValue;
      restrictionsSet.add(newRestrictions);
      return { ...state, configs: newConfigs };

    case ActionTypes.SPLIT_BY:
      act = action as ISplitBy;
      console.log(
        `SPLITTING CHART  ${act.payload.metricId}! Creating new chart for each variant of ${act.payload.param}.`
      );
      newConfigs = state.configs.clone();
      let restrictions = newConfigs.get(act.payload.metricId);
      restrictions.remove(act.payload.restrictions);
      act.payload.variants.forEach((variant) => {
        const newRestrictions = { ...act.payload.restrictions };
        newRestrictions[act.payload.param] = variant;
        restrictions.add(newRestrictions);
      });

      return { ...state, configs: newConfigs };

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
      updatedState.configs.get(act.payload.metricId).add({});
      // ^ no restrictions, so all lines will be rendered
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
