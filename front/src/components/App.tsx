import * as React from "react";
import { connect, Provider } from "react-redux";
import { configureStore, initStore } from "../store/init";
import { useWindowSize } from "./hooks";
import { Chart } from "./charts/Chart";
import { AppState, ChartSpec } from "../store/models";
import { calculate } from "./charts/calculate";
import "./../styles.css";
import { HashRouter, Route, Switch } from "react-router-dom";
import { RouteConfig } from "react-router-config";
import MetricIdInput from "./MetricIdInput";
import * as _ from "lodash";
import { paramsHash, Point } from "../models/Point";

const configsToCharts = (
  cache: { [metricId: string]: Point[] },
  specs: ChartSpec[],
  metricId: string,
  chartWidth: number,
  chartHeight: number
): JSX.Element[] => {
  return specs.map((spec) => {
    const { restrictions, xAccessor } = spec;
    const isOk = (p: Point): boolean => {
      return _.entries(restrictions).every(([param, value]) => {
        return p._params[param] === value;
      });
    };
    const points = cache[metricId].filter(isOk);
    const data = calculate(points, xAccessor);
    return (
      <Chart
        key={`${metricId}::${paramsHash(restrictions)}`}
        metricId={metricId}
        width={chartWidth}
        height={chartHeight}
        data={data}
        spec={spec}
      />
    );
  });
};

const Spa = (
  props: AppState & {
    dispatch: any;
    match: any;
  }
) => {
  const [width, height] = useWindowSize();
  const chartWidth = width >= 600 ? 600 : width;
  const chartHeight = height >= 300 ? 300 : height;

  console.log(props.configs);
  const charts = _.flatMap([...props.configs], ([metricId, chartSpecs]) => {
    return configsToCharts(
      props.cache,
      [...chartSpecs],
      metricId,
      chartWidth,
      chartHeight
    );
  });

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

function mapStateToProps(state: AppState): AppState {
  return {
    cache: state.cache,
    configs: state.configs,
    last_message: state.last_message,
  };
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
