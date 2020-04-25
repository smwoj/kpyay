import { connect } from "react-redux";
import { Action } from "redux";
import { Input } from "antd";
import {
  failedToFetchPointsAction,
  fetchedPointsAction,
} from "../store/actions";
import * as React from "react";
import * as mock_data from "../mock_data/data";
import { Point } from "../models/Point";
const MOCK_DATA: { [metricId: string]: Point[] } = {
  "sloths-pastry f-score": mock_data.SLOTHS_VS_PASTRY_FSCORES,
  beta: mock_data.DOGS_VS_MUFFINS_FSCORES,
  gamma: mock_data.SLOTHS_VS_PASTRY_FSCORES,
  delta: mock_data.SLOTHS_VS_PASTRY_FSCORES,
  "dogs-muffins f-score": mock_data.DOGS_VS_MUFFINS_FSCORES,
};

export async function getMetricData(metricId: string): Promise<Point[]> {
  const points = MOCK_DATA[metricId];
  if (points === undefined) {
    console.log("bad stuff happened, can't fetch data for " + metricId);
    return Promise.reject(
      new Error(`Data for metric ${metricId} couldn't be fetched.`)
    );
  } else {
    return Promise.resolve(points);
  }
}
// TODO: restore REAL IMPL
// const BACKEND_URL = "http://127.0.0.1:8088";
// async function getMetricData(metricId: string): Promise<Point[]> {
//   // Default options are marked with *
//   const response = await fetch(`${BACKEND_URL}/${metricId}`, {
//     method: "GET",
//     mode: "cors",
//     cache: "no-cache",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   return response.text(); // TODO: deserialize the points
// }
// // debug stuff
// const fetchMetric = (metricId = "SHREK VS NO SHREK CLASSIFIERS HAPPINESS") => {
//   // TODO: return actions containing fetched data instead
//   getMetricData(metricId).then(
//     (data) => {
//       console.log("Got data:", data);
//     },
//     (err) => {
//       console.log("NO BUENO:", err);
//     }
//   );
// };

const MetricIdInput = (props: {
  dispatch: (action: Action) => void;
}): JSX.Element => {
  return (
    <Input
      size="default"
      placeholder="metricId"
      onPressEnter={(e) => {
        const metricId = e.currentTarget.value;

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
