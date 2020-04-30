import { Button, Dropdown, Menu } from "antd";
import * as React from "react";
import * as _ from "lodash";
import { connect } from "react-redux";
import { Action } from "redux";
import {
  restrictAction,
  deleteChartAction,
  splitByAction,
  switchXAxisAction,
} from "../../store/actions";
import { ChartSpec } from "../../store/models";

interface DeleteButtonProps {
  spec: ChartSpec;
}
const _DeleteButton = (
  props: DeleteButtonProps & {
    dispatch: (a: Action) => void;
  }
) => (
  <Button onClick={() => props.dispatch(deleteChartAction(props.spec))}>
    delete
  </Button>
);

export const DeleteButton: React.FunctionComponent<DeleteButtonProps> = connect()(
  _DeleteButton
);

interface SwitchXAxisButtonProps {
  spec: ChartSpec;
}
const _SwitchXAxisButton = (
  props: SwitchXAxisButtonProps & {
    dispatch: (a: Action) => void;
  }
) => {
  const otherXAccessor =
    "timestamp" === props.spec.xAccessor ? "version" : "timestamp";
  return (
    <Button onClick={() => props.dispatch(switchXAxisAction(props.spec))}>
      {`${otherXAccessor} on x-axis`}
    </Button>
  );
};

export const SwitchXAxisButton: React.FunctionComponent<SwitchXAxisButtonProps> = connect()(
  _SwitchXAxisButton
);

/**
 * Button with dropdown menu.
 * Clicking a variant executes callback associated in `variantsToExecutors`.
 */
export const ExecutablesDropdown = (props: {
  text: string;
  variantsToExecutors: { [variant: string]: () => void };
}): JSX.Element => {
  const menuItems = _.map(props.variantsToExecutors, (executor, variant) => (
    <Menu.Item key={variant}>
      <Button onClick={executor}>{variant}</Button>
    </Menu.Item>
  ));
  const menu = <Menu>{menuItems}</Menu>;

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
const _SelectDropdown = (
  props: {
    paramName: string;
    variants: string[];
    spec: ChartSpec;
  } & {
    dispatch: (a: Action) => void;
  }
): JSX.Element => {
  const { paramName, spec } = props;
  const text = `select ${props.paramName}`;
  const variantsToExecutors = _.fromPairs(
    props.variants.map((variant) => [
      variant,
      () => props.dispatch(restrictAction(spec, paramName, variant)),
    ])
  );
  return (
    <ExecutablesDropdown
      text={text}
      variantsToExecutors={variantsToExecutors}
    />
  );
};

export const SelectDropdown = connect()(_SelectDropdown);

/**
 * ExecutablesDropdown wrapper.
 * Knows how to dispatch redux action for splitting chart.
 */
const _SplitByButton = (
  props: {
    paramName: string;
    variants: string[];
    spec: ChartSpec;
  } & {
    dispatch: (a: Action) => void;
  }
): JSX.Element => {
  const { paramName, variants, spec } = props;
  return (
    <Button
      onClick={() => props.dispatch(splitByAction(spec, paramName, variants))}
    >{`split by ${paramName}`}</Button>
  );
};
export const SplitByButton = connect()(_SplitByButton);
