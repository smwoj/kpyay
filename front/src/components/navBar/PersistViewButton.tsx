import { Action } from "redux";
import { Input } from "antd";
import {
  failedToSaveViewAction,
  savedViewAction,
  showMessageAction,
} from "../../store/actions";
import { connect } from "react-redux";
import * as React from "react";
import { AppState, ChartSpec } from "../../store/models";
import { BFSet } from "../../lib/collections/BFSet";
import { saveView } from "../../backendApi";

interface SaveViewButtonProps {
  configs: BFSet<ChartSpec>;
  currentViewName: string | null;
}

function mapStateToProps(state: AppState): SaveViewButtonProps {
  return {
    configs: state.configs,
    currentViewName: state.viewName,
  };
}
const { Search } = Input;

const SaveView = (
  props: SaveViewButtonProps & {
    dispatch: (action: Action) => void;
  }
): JSX.Element => {
  const { configs, currentViewName, dispatch } = props;
  // TODO: fix - (new view name) - with predefined views it doesn't correctly show view name
  return (
    <Search
      placeholder={
        currentViewName ? `current view: ${currentViewName}` : "(new view name)"
      }
      enterButton="Save"
      size="large"
      onSearch={(viewName) => {
        if (viewName === "") {
          dispatch(showMessageAction("Can't save a view with no name!"));
        } else {
          saveView(viewName, configs).then(
            () => {
              console.log(`succesfully saved view ${viewName}`);
              dispatch(savedViewAction(viewName));
            },
            (err) => {
              console.log("Error while trying to persist the view:", err);
              dispatch(failedToSaveViewAction(viewName, err.toString())); // + status?
            }
          );
        }
        // clear search
      }}
    />
  );
};

export const SaveViewButton = connect(mapStateToProps)(SaveView);
