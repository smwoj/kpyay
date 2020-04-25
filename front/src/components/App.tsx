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
import MetricIdInput, { getMetricData } from "./MetricIdInput";
import * as _ from "lodash";
import { Point } from "../models/Point";
import stringify from "json-stable-stringify";
import { SaveViewButton } from "./viewPersistance/PersistViewButton";
import { loadView } from "./viewPersistance/api";
import { useEffect } from "react";
import {
  failedToFetchPointsAction,
  fetchedConfigAction,
  fetchedPointsAction,
  showMessageAction,
} from "../store/actions";

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
        key={stringify(spec)}
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
  // const viewName = props.match.url.slice(1);
  // const dispatch = props.dispatch;
  // useEffect(() => {
  //   console.log(`Fetching data for view: ${viewName}`);
  //   loadView(viewName).then(
  //     (cfg) => {
  //       Object.keys(cfg.data).forEach((metricId) => {
  //         // todo: wywal duplikację
  //         getMetricData(metricId).then(
  //           (points) => {
  //             console.log(`Got ${points.length} points for ${metricId}`);
  //             props.dispatch(fetchedPointsAction(metricId, points));
  //           },
  //           (err) => {
  //             console.log("NO BUENO:", err);
  //             props.dispatch(
  //               failedToFetchPointsAction(metricId, err.toString())
  //             );
  //           }
  //         );
  //       });
  //       dispatch(fetchedConfigAction(viewName, cfg));
  //     },
  //     (err) => {
  //       const msg = `Couldn't fetch view: ${viewName}, error: ${err.toString()}`;
  //       console.log(msg);
  //       dispatch(showMessageAction(msg));
  //     }
  //   );
  // }, [viewName]);

  const [width, height] = useWindowSize();
  const chartWidth = width >= 600 ? 600 : width;
  const chartHeight = height >= 300 ? 300 : height;

  const specsByMetric = _.groupBy([...props.configs], (cfg) => cfg.metricId);
  const charts = _.flatMap(
    Object.entries(specsByMetric),
    ([metricId, chartSpecs]) => {
      return configsToCharts(
        props.cache,
        [...chartSpecs],
        metricId,
        chartWidth,
        chartHeight
      );
    }
  );

  return (
    <div className="app-div">
      <header className="App-header">
        {/*<h1>{viewName ? "View: " + viewName : "(unnamed view)"}</h1>*/}
        {/*wrzuć to w reduxa i ustawiaj jeśli ściąganie pykło*/}
        <p>{props.last_message}</p>
        <div className="example-input">
          <MetricIdInput />
          <SaveViewButton />
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
    path: "/:slug",
    component: () => <App />,
  },
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
