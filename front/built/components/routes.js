import * as React from "react";
import { Route, Switch } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { TodoPage } from "./pages/TodoPage";
import AboutPage from "./pages/AboutPage";
import PageLayout from "./layouts/PageLayout";
export var routes = [
    {
        path: "/home",
        exact: true,
        component: function () { return (React.createElement(HomePage, null)); },
    },
    {
        path: "/todo",
        component: function () { return (React.createElement(TodoPage, null)); },
    },
    {
        path: "/about",
        component: function () { return (React.createElement(AboutPage, null)); },
    },
];
export var route = (React.createElement(Switch, null,
    React.createElement(Route, { path: "/", component: PageLayout })));
//# sourceMappingURL=routes.js.map