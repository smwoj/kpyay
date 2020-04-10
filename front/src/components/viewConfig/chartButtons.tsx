import { Button, Dropdown, Menu } from "antd";
import * as React from "react";
import * as _ from "underscore";

export const DeleteButton = (props: { deleteCallback: () => void }) => (
  <Button onClick={() => props.deleteCallback()}>delete</Button>
);

export const RestrictionDropdown = (props: {
  text: string;
  variantsToExecutors: { [variant: string]: () => {} };
}): JSX.Element => {
  const menu_items = _.map(props.variantsToExecutors, (executor, variant) => (
    <Menu.Item key={variant}>
      <Button onClick={executor}>{variant}</Button>
    </Menu.Item>
  ));
  const menu = <Menu>{menu_items}</Menu>;

  return (
    <Dropdown overlay={menu} placement="bottomLeft">
      <a className="chartRestrictionButton" onClick={(e) => e.preventDefault()}>
        <Button>{props.text}</Button>
      </a>
    </Dropdown>
  );
};
