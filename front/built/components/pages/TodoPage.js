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
import * as Redux from "redux";
import { connect } from "react-redux";
import { Card, Table, Button, Modal, Input } from "antd";
import { actionCreators } from "../actions/actions";
var Column = Table.Column;
var TodoPageComponent = /** @class */ (function (_super) {
    __extends(TodoPageComponent, _super);
    function TodoPageComponent(props) {
        var _this = _super.call(this, props) || this;
        _this.handleOk = function () {
            var item = {
                id: 0,
                key: 0,
                name: _this.state.newTaskName,
                isCompleted: false,
            };
            _this.props.actions.addTodoAction(item);
            _this.setState({ modalVisible: false });
        };
        _this.handleCancel = function () {
            _this.setState({ modalVisible: false });
        };
        _this.state = {
            modalVisible: false,
            newTaskName: "",
        };
        _this.handleOk = _this.handleOk.bind(_this);
        _this.handleCancel = _this.handleCancel.bind(_this);
        return _this;
    }
    TodoPageComponent.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", null,
            React.createElement(Card, { bordered: true, title: "Todo List", style: { margin: "16px 16px" } },
                React.createElement(Button, { type: "primary", icon: "plus", onClick: function () { _this.setState({ modalVisible: true }); } }, "New Task"),
                React.createElement(Table, { dataSource: this.props.todoItems },
                    React.createElement(Column, { title: "Id", dataIndex: "id", key: "id" }),
                    React.createElement(Column, { title: "Task", dataIndex: "name", key: "name" }),
                    React.createElement(Column, { title: "Status", dataIndex: "isCompleted", key: "isCompleted", render: function (text, record, index) {
                            return React.createElement("span", null, record.isCompleted ? "Completed" : "Pending");
                        } }),
                    React.createElement(Column, { title: "Action", key: "action", render: function (text, record, index) { return (React.createElement(Button, { type: "primary", disabled: record.isCompleted, onClick: function () {
                                record.isCompleted = true;
                                _this.props.actions.completeTodoAction(record);
                            } }, "Complete")); } }))),
            React.createElement(Modal, { title: "New Task", visible: this.state.modalVisible, onOk: function () { return _this.handleOk(); }, onCancel: function () { return _this.handleCancel(); } },
                React.createElement(Input.TextArea, { placeholder: "Input the name of the task", rows: 4, onChange: function (e) {
                        _this.setState({ newTaskName: e.target.value });
                    } }))));
    };
    return TodoPageComponent;
}(React.Component));
var mapStateToProps = function (state) {
    return {
        todoItems: state.todos,
    };
};
var mapDispatchToProps = function (dispatch) {
    return {
        actions: Redux.bindActionCreators(actionCreators, dispatch),
    };
};
export var TodoPage = connect(mapStateToProps, mapDispatchToProps)(TodoPageComponent);
//# sourceMappingURL=TodoPage.js.map