import * as React from "react";
import * as ReactDOM from "react-dom";
import { Page } from "./components/App";

ReactDOM.render(<Page />, document.getElementById("app"));

// Hot Module Replacement
declare let module: { hot: any };

if (module.hot) {
  module.hot.accept("./components/App", () => {
    const UpdatedPage = require("./components/App").default;

    ReactDOM.render(<UpdatedPage />, document.getElementById("app"));
  });
}
