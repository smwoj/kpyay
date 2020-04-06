var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from "react";
import { Card } from "antd";
var AboutPage = /** @class */ (function (_super) {
    __extends(AboutPage, _super);
    function AboutPage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AboutPage.prototype.render = function () {
        return (React.createElement(Card, { bordered: true, title: "About", style: { margin: "16px 16px" } },
            React.createElement("p", null, "A demo web app based on React and written in TypeScript. "),
            React.createElement("p", null,
                "For details, please see \u00A0",
                React.createElement("a", { href: "https://github.com/chunliu/typescript-react-hot-reload" }, "https://github.com/chunliu/typescript-react-hot-reload"))));
    };
    return AboutPage;
}(React.Component));
export default AboutPage;
//# sourceMappingURL=AboutPage.js.map