import { Button, Dropdown, Menu } from "antd";
import * as React from "react";
import * as _ from "underscore";

export const DeleteButton = (props: { deleteCallback: () => void }) => (
  <Button onClick={() => props.deleteCallback()}>hide</Button>
);

/**
 * Button with dropdown menu.
 * Clicking a variant executes callback associated in `variantsToExecutors`.
 */
export const ExecutablesDropdown = (props: {
  text: string;
  variantsToExecutors: { [variant: string]: () => void };
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

/**
 * ExecutablesDropdown wrapper.
 * Knows how to dispatch redux action for limiting the number of lines on chart.
 */
export const SelectDropdown = (props: {
  paramName: string;
  variants: string[];
  select: (restriction: string) => void;
}): JSX.Element => {
  const text = `select ${props.paramName}`;
  const variantsToExecutors = _.object(
    props.variants.map((variant) => [
      variant,
      () => props.select(`${props.paramName}=${variant}`),
    ])
  );
  return (
    <ExecutablesDropdown
      text={text}
      variantsToExecutors={variantsToExecutors}
    />
  );
};

/**
 * ExecutablesDropdown wrapper.
 * Knows how to dispatch redux action for splitting chart.
 */
export const SplitByDropdown = (props: {
  paramName: string;
  variants: string[];
  splitBy: (param: string) => void;
}): JSX.Element => {
  const text = `split by ${props.paramName}`; // rename to split by
  const variantsToExecutors = _.object(
    props.variants.map((variant) => [
      variant,
      () => props.splitBy(props.paramName),
    ])
  );
  return (
    <ExecutablesDropdown
      text={text}
      variantsToExecutors={variantsToExecutors}
    />
  );
};
