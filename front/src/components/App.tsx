import * as React from "react";
import { connect, Provider } from "react-redux";
import { configureStore, initStore } from "../store/init";
import { useWindowSize } from "./hooks";
import { Chart } from "./charts/Chart";
import { AppState } from "../store/models";
import {
  addRestrictionAction,
  deleteChartAction,
  splitByAction,
} from "../store/actions";
import { calculate } from "./charts/calculate";
import "./../styles.css";
import { HashRouter, Route, Switch } from "react-router-dom";
import { RouteConfig } from "react-router-config";
import MetricIdInput from "./MetricIdInput";

const Spa = (
  props: AppState & {
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
        {/*<h1>{"slug: " + props.match.url}</h1>*/}
        <p>{props.last_message}</p>
        <div className="example-input">
          <MetricIdInput />
        </div>
        <div>{charts}</div>
      </header>
    </div>
  );
};

function mapStateToProps(state: AppState) {
  return { chartsData: state.chartsData, last_message: state.last_message };
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
