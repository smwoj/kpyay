import * as React from "react";
import { connect, Provider } from "react-redux";
import { configureStore, initStore } from "../store/init";
import { Chart } from "./charts/Chart";
import { AppState, ChartSpec } from "../store/models";
import { calculate } from "./charts/calculate";
import "./../styles.css";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import MetricIdInput from "./navBar/MetricIdInput";
import * as _ from "lodash";
import { Point } from "../models/Point";
import stringify from "json-stable-stringify";
import { SaveViewButton } from "./navBar/PersistViewButton";
import { useEffect, useState } from "react";
import {
  setConfigAction,
  fetchedPointsAction,
  showMessageAction,
} from "../store/actions";
import { Action } from "redux";
import { BFSet } from "../lib/collections/BFSet";
import ToggleCfgVisibilityButton from "./navBar/ToggleCfgVisibility";
import { getMetricData, loadView } from "../backendApi";

const configsToCharts = (
  cache: { [metricId: string]: Point[] },
  specs: ChartSpec[],
  metricId: string,
  chartWidth: number,
  chartHeight: number
): JSX.Element[] => {
  const specsInStableOrder = _.sortBy(specs, (s) => stringify(s.restrictions));
  return specsInStableOrder.map((spec) => {
    const { restrictions, xAccessor } = spec;
    const isOk = (p: Point): boolean => {
      return _.entries(restrictions).every(([param, value]) => {
        return p.params[param] === value;
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
    return (
      <div className="chart-div" key={stringify(spec)}>
        <Chart
          width={chartWidth}
          height={chartHeight}
          data={data}
          spec={spec}
        />
      </div>
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

const TransientMessage = (props: { message: string }) => {
  const [leftSeconds, setLeftSeconds] = useState(5);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLeftSeconds(leftSeconds ? leftSeconds - 1 : 0);
    }, 1000);
    return () => clearTimeout(timer);
  }, [leftSeconds]);

  const dots = ".".repeat(leftSeconds);
  const empty = " ";

  return (
    <span className="disappearing-msg">
      <p>{leftSeconds > 0 ? dots + props.message + dots : empty}</p>
    </span>
  );
};

const Spa = (
  props: AppState & {
    dispatch: any;
    match: any;
  }
) => {
  const chartWidth = 600;
  const chartHeight = 350;

  console.log(`configs: ${stringify([...props.configs])}`);

  const specsByMetric = _.groupBy([...props.configs], (cfg) => cfg.metricId);
  const specsInStableOrder = _.sortBy(
    Object.entries(specsByMetric),
    ([metricId, _specs]) => metricId
  );
  const charts = _.flatMap(specsInStableOrder, ([metricId, chartSpecs]) => {
    return configsToCharts(
      props.cache,
      [...chartSpecs],
      metricId,
      chartWidth,
      chartHeight
    );
  });

  return (
    <div id="app-div">
      <div className="ui-bar">
        <div className="ui-bar-elem cfg-vis-btn">
          <ToggleCfgVisibilityButton />
        </div>
        <div className="ui-bar-elem metric-id-inp">
          <MetricIdInput />
        </div>
        <div className="ui-bar-elem save-view-btn">
          <SaveViewButton />
        </div>
      </div>
      <TransientMessage message={props.last_message} key={props.last_message} />
      <section className="charts-grid">{charts}</section>
    </div>
  );
};

const App = connect((s) => ({ ...s }))(Spa);

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
        // @ts-ignore
        setView(<Redirect to="/" />);
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
