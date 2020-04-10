import * as React from "react";
import { Provider } from "react-redux";
import { configureStore, initStore } from "../store/init";
import { useWindowSize } from "./hooks";
import { Chart } from "./Chart";
import { AppState } from "../store/models";
import { deleteChartAction, addRestrictionAction } from "../store/actions";
import "./../styles.css";

const store = configureStore();
store.dispatch<any>(initStore());

const App = () => {
  const [width, height] = useWindowSize();

  const chartWidth = width >= 600 ? 600 : width;
  const chartHeight = height >= 300 ? 300 : height;

  const state: AppState = store.getState();

  const charts: JSX.Element[] = Object.entries(state.chartsData).map(
    ([metricId, points]) => {
      return (
        <Chart
          key={metricId}
          width={chartWidth}
          height={chartHeight}
          data={points}
          name={metricId}
          deleteChart={(chartId) => {
            store.dispatch(deleteChartAction(chartId));
          }}
          select={(chartId, restriction) => {
            store.dispatch(addRestrictionAction(chartId, restriction));
          }}
        />
      );
    }
  );
  return (
    <Provider store={store}>
      <div className="app-div">
        <header className="App-header">
          <div>{charts}</div>
        </header>
      </div>
    </Provider>
  );
};

export default App;
