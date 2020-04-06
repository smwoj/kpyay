import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./components/App";
ReactDOM.render(React.createElement(App, null), document.getElementById("app"));
if (module.hot) {
    module.hot.accept("./components/App", function () {
        var NewApp = require("./components/App").default;
        ReactDOM.render(React.createElement(NewApp, null), document.getElementById("app"));
    });
}
//# sourceMappingURL=index.js.map