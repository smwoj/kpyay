import * as React from "react";
import { connect, Provider } from "react-redux";
import { configureStore, initStore } from "../store/init";
import { useWindowSize } from "./hooks";
import { Chart } from "./charts/Chart";
import { AppState, Point } from "../store/models";
import {
  deleteChartAction,
  addRestrictionAction,
  splitByAction,
  fetchedPointsAction,
  failedToFetchPointsAction,
} from "../store/actions";
import { calculate } from "./charts/calculate";
import "./../styles.css";
import { Input } from "antd";
import { HashRouter } from "react-router-dom";
import { RouteConfig } from "react-router-config";
import { Route, Switch } from "react-router-dom";
import * as mock_data from "../mock_data/data";

const MOCK_DATA: { [metricId: string]: Point[] } = {
  "sloths-pastry f-score": mock_data.SLOTHS_VS_PASTRY_FSCORES,
  beta: mock_data.DOGS_VS_MUFFINS_FSCORES,
  gamma: mock_data.SLOTHS_VS_PASTRY_FSCORES,
  delta: mock_data.SLOTHS_VS_PASTRY_FSCORES,
  "dogs-muffins f-score": mock_data.DOGS_VS_MUFFINS_FSCORES,
};
async function getMetricData(metricId: string): Promise<Point[]> {
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

const Spa = (
  props: { chartsData: { [metricId: string]: Point[] } } & {
    dispatch: any;
    match: any;
  }
) => {
  console.log(Object.keys(props.chartsData));
  const [width, height] = useWindowSize();
  const chartWidth = width >= 600 ? 600 : width;
  const chartHeight = height >= 300 ? 300 : height;

  const charts: JSX.Element[] = Object.entries(props.chartsData).map(
    ([metricId, points]) => {
      const data = calculate(points, {
        metricId,
        filters: [],
        xAccessor: "version",
      });
      return (
        <Chart
          key={metricId}
          width={chartWidth}
          height={chartHeight}
          data={data}
          deleteChart={(chartId) => {
            props.dispatch(deleteChartAction(chartId));
          }}
          select={(chartId, restriction) => {
            props.dispatch(addRestrictionAction(chartId, restriction));
          }}
          splitBy={(chartId, param) => {
            props.dispatch(splitByAction(chartId, param));
          }}
        />
      );
    }
  );
  return (
    <div className="app-div">
      <header className="App-header">
        <h1>{"slug: " + props.match.url}</h1>
        <p>"szczępienie ryjca (a tak srsly notyfikacja o brzydkich eventach"</p>
        <div className="example-input">
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
                  props.dispatch(failedToFetchPointsAction(metricId, err));
                }
              );
            }}
          />
        </div>
        <div>{charts}</div>
      </header>
    </div>
  );
};

function mapStateToProps(state: AppState) {
  return { chartsData: state.chartsData };
}
const App = connect(mapStateToProps)(Spa);

export const routes: RouteConfig[] = [
  {
    path: "/",
    component: () => <App />,
  },
  // {
  //   path: "/todo",
  //   component: () => <TodoPage />,
  // },
];

const route = (
  <Switch>
    <Route path="/:view" component={App} />
    <Route path="/" component={App} />
  </Switch>
);

const store = configureStore();
store.dispatch<any>(initStore());

export const Page = (): JSX.Element => {
  return (
    <Provider store={store}>
      <HashRouter children={route} />
    </Provider>
  );
};
