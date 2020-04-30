import { connect } from "react-redux";
import { Action } from "redux";
import { Input } from "antd";
import {
  failedToFetchPointsAction,
  fetchedPointsAction,
} from "../store/actions";
import * as React from "react";
import { getMetricData } from "../backendApi";

const { Search } = Input;

const MetricIdInput = (props: {
  dispatch: (action: Action) => void;
}): JSX.Element => {
  return (
    <Search
      placeholder="metricId"
      enterButton="Load"
      size="large"
      onSearch={(metricId) => {
        getMetricData(metricId).then(
          (points) => {
            console.log(`Got ${points.length} points for ${metricId}`);
            props.dispatch(fetchedPointsAction(metricId, points));
          },
          (err) => {
            console.log("NO BUENO:", err);
            props.dispatch(failedToFetchPointsAction(metricId, err.toString()));
          }
        );
      }}
    />
  );
};
export default connect()(MetricIdInput);
