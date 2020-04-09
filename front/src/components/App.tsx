import * as React from "react";
import {Provider} from "react-redux";
import {configureStore, initStore} from "../store/init";
import {useWindowSize} from "./hooks";
import {Chart} from "./Chart";
import {AppState} from "../store/models";


const store = configureStore();
store.dispatch<any>(initStore());


const App = () => {
    const [width, height] = useWindowSize();

    const chartWidth = width >= 600 ? 600 : width;
    const chartHeight = height >= 300 ? 300 : height;

    const state: AppState = store.getState();

    const charts: JSX.Element[] = Object.entries(state.chartsData).map(
        ([metricId, points]) => {
            return <Chart key={metricId} width={chartWidth} height={chartHeight} data={points} name={metricId}/>;
        }
    );
    return (
        <Provider store={store}>
            <div className="App">
                <header className="App-header">
                    <h1>Twoja stara cedzi kaszę xDDD</h1>
                    <br/>
                    <div>{charts}</div>
                </header>
            </div>
        </Provider>
    );
};

export default App;
