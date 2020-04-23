import { Action } from "redux";
import { Input } from "antd";
import {
  showMessageAction,
  savedViewAction,
  failedToSaveViewAction,
} from "../../store/actions";
import { connect } from "react-redux";
import * as React from "react";
import { AppState, ChartSpec } from "../../store/models";
import { DefaultDict } from "../../lib/collections/DefaultDict";
import { BFSet } from "../../lib/collections/BFSet";
import stringify from "json-stable-stringify";

interface SaveViewButtonProps {
  configs: DefaultDict<BFSet<ChartSpec>>;
}

function mapStateToProps(state: AppState): SaveViewButtonProps {
  return {
    configs: state.configs,
  };
}

//mock impl - real api calls are waiting for server implementation
async function saveView(
  viewName: string,
  config: DefaultDict<BFSet<ChartSpec>>
): Promise<void> {
  if (viewName.startsWith("a")) {
    const msg = `'${viewName}' is not a good view name, pick something else`;
    console.log(msg);
    return Promise.reject(new Error(msg));
  } else {
    console.log(
      `OK, saved view '${viewName}' with config: ${stringify(config)}`
    );
    return Promise.resolve();
  }
}

const SaveView = (
  props: SaveViewButtonProps & {
    dispatch: (action: Action) => void;
  }
): JSX.Element => {
  return (
    <Input
      size="default"
      placeholder="(name of your view)"
      onPressEnter={(e) => {
        const viewName = e.currentTarget.value;
        if (viewName === "") {
          props.dispatch(showMessageAction("Can't save a view with no name!"));
        } else {
          saveView(viewName, props.configs).then(
            () => {
              console.log(`succesfully saved view ${viewName}`);
              props.dispatch(savedViewAction(viewName));
            },
            (err) => {
              console.log("Error while trying to persist the view:", err);
              props.dispatch(failedToSaveViewAction(viewName, err.toString())); // + status?
            }
          );
        }
      }}
    />
  );
};

export const SaveViewButton = connect(mapStateToProps)(SaveView);
