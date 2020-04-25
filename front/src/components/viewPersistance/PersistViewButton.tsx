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
import { saveView } from "./api";

interface SaveViewButtonProps {
  configs: BFSet<ChartSpec>;
  currentViewName?: string;
}

function mapStateToProps(state: AppState): SaveViewButtonProps {
  return {
    configs: state.configs,
  };
}

const SaveView = (
  props: SaveViewButtonProps & {
    dispatch: (action: Action) => void;
  }
): JSX.Element => {
  const { configs, currentViewName, dispatch } = props;
  return (
    <Input
      size="default"
      placeholder={currentViewName || "(name of your view)"}
      onPressEnter={(e) => {
        const viewName = (e.currentTarget.value || currentViewName) as string;
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
      }}
    />
  );
};

export const SaveViewButton = connect(mapStateToProps)(SaveView);
