import * as React from "react";
import { connect, Provider } from "react-redux";
import { configureStore, initStore } from "../store/init";
import { useWindowSize } from "./hooks";
import { Chart } from "./charts/Chart";
import { AppState } from "../store/models";
import {
  deleteChartAction,
  addRestrictionAction,
  splitByAction,
  fetchMetricAction,
} from "../store/actions";
import { calculate } from "./charts/calculate";
import "./../styles.css";
import { Input } from "antd";

const store = configureStore();
store.dispatch<any>(initStore());

const App = () => {
  const [width, height] = useWindowSize();

  const chartWidth = width >= 600 ? 600 : width;
  const chartHeight = height >= 300 ? 300 : height;

  const state: AppState = store.getState();

  const charts: JSX.Element[] = Object.entries(state.chartsData).map(
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
            store.dispatch(deleteChartAction(chartId));
          }}
          select={(chartId, restriction) => {
            store.dispatch(addRestrictionAction(chartId, restriction));
          }}
          splitBy={(chartId, param) => {
            store.dispatch(splitByAction(chartId, param));
          }}
        />
      );
    }
  );
  return (
    <Provider store={store}>
      <div className="app-div">
        <header className="App-header">
          <div className="example-input">
            <Input
              size="default"
              placeholder="metricId"
              onPressEnter={(e) => {
                console.log("kurla", e.currentTarget.value);
                fetchMetricAction(e.currentTarget.value);
              }}
            />
          </div>
          <div>{charts}</div>
        </header>
      </div>
    </Provider>
  );
};

// function mapStateToProps(state: AppState, ownProps) {
//   return {
//     chartsData: state.chartsData,
//   };
// }
//
// export default connect(mapStateToProps)(App);
export default App;
