import * as React from "react";
import { connect, Provider } from "react-redux";
import { configureStore, initStore } from "../store/init";
import { useWindowSize } from "./hooks";
import { Chart } from "./charts/Chart";
import { AppState, ChartSpec } from "../store/models";
import { calculate } from "./charts/calculate";
import "./../styles.css";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import MetricIdInput, { getMetricData } from "./MetricIdInput";
import * as _ from "lodash";
import { Point } from "../models/Point";
import stringify from "json-stable-stringify";
import { SaveViewButton } from "./viewPersistance/PersistViewButton";
import { loadView } from "./viewPersistance/api";
import { useEffect, useState } from "react";
import {
  setConfigAction,
  fetchedPointsAction,
  showMessageAction,
} from "../store/actions";
import { Action } from "redux";
import { BFSet } from "../lib/collections/BFSet";

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
    if (points.length === 0) {
      throw new Error(
        `No points for rendering for specs ${stringify(
          specs
        )}. Available data keys: ${Object.keys(cache)}`
      );
    }
    const data = calculate(points, xAccessor);
    console.log(`${stringify(specs)} -> ${data.data.length}`);
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

const getAndDispatch = async (
  metricId: string,
  dispatch: (a: Action) => void
) => {
  const points = await getMetricData(metricId);
  dispatch(fetchedPointsAction(metricId, points));
};

const executeView = async (viewName: string, dispatch: (a: Action) => void) => {
  const cfg = await loadView(viewName);
  const uniqueIds = _.uniq(_.map([...cfg], (c) => c.metricId));
  await Promise.all(
    uniqueIds.map((metricId) => getAndDispatch(metricId, dispatch))
  );
  dispatch(setConfigAction(viewName, cfg));
};

const Spa = (
  props: AppState & {
    dispatch: any;
    match: any;
  }
) => {
  const { viewName } = props;

  const [width, height] = useWindowSize();
  const chartWidth = width >= 600 ? 600 : width;
  const chartHeight = height >= 300 ? 300 : height;

  console.log(`configs: ${stringify([...props.configs])}`);

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

  const viewHeader = viewName ? <h1>{viewName}</h1> : null;
  return (
    <div className="app-div">
      <header className="App-header">
        {viewHeader}
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
    viewName: state.viewName,
    cache: state.cache,
    configs: state.configs,
    last_message: state.last_message,
  };
}
const App = connect(mapStateToProps)(Spa);

const _PredefinedView = (props: {
  dispatch: (a: Action) => void;
  match: any;
}) => {
  const viewName = props.match.url.slice(1);
  const dispatch = props.dispatch;

  const [view, setView] = useState(<h1>{`Please wait...`}</h1>);

  useEffect(() => {
    console.log("executing effect");
    if (!viewName) {
      return;
    } else {
      dispatch(setConfigAction(viewName, new BFSet<ChartSpec>()));
    }
    executeView(viewName, dispatch).then(
      () => {
        dispatch(showMessageAction(`Loaded view ${viewName}`));
        console.log("Loading view OK, rendering...");
        setView(<App />);
      },
      (err) => {
        dispatch(
          showMessageAction(
            `View loading error: ${err.toString()}. Redirected to new view.`
          )
        );
        console.log("Loading view FAILED, redirecting to new view...");
        setView(<Redirect to="/" />);
      }
    );
  }, [props.match.url]);

  return view;
};
const PredefinedView = connect()(_PredefinedView);

const route = (
  <Switch>
    <Route path="/:view" component={PredefinedView} />
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
