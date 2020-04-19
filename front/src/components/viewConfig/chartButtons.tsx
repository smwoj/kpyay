import { Button, Dropdown, Menu } from "antd";
import * as React from "react";
import * as _ from "underscore";
import { connect } from "react-redux";
import { Action } from "redux";
import {
  restrictAction,
  deleteChartAction,
  splitByAction,
} from "../../store/actions";
import { Restrictions } from "../../store/models";

const _DeleteButton = (
  props: { metricId: string; restrictions: Restrictions } & {
    dispatch: (a: Action) => void;
  }
) => (
  <Button
    onClick={() =>
      props.dispatch(deleteChartAction(props.metricId, props.restrictions))
    }
  >
    delete
  </Button>
);
export const DeleteButton = connect()(_DeleteButton);

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
const _SelectDropdown = (
  props: {
    paramName: string;
    variants: string[];
    metricId: string;
    restrictions: Restrictions;
  } & {
    dispatch: (a: Action) => void;
  }
): JSX.Element => {
  const { paramName, metricId, restrictions } = props;
  const text = `select ${props.paramName}`;
  const variantsToExecutors = _.object(
    props.variants.map((variant) => [
      variant,
      () =>
        props.dispatch(
          restrictAction(metricId, restrictions, paramName, variant)
        ),
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
const _SplitByDropdown = (
  // PRZECIEZ TO NIE POTRZEBUJE DROPDOWNA? wtf - TODO - zrób z tego baton
  props: {
    paramName: string;
    variants: string[];
    metricId: string;
    restrictions: Restrictions;
  } & {
    dispatch: (a: Action) => void;
  }
): JSX.Element => {
  const text = `split by ${props.paramName}`;
  const variantsToExecutors = _.object(
    props.variants.map((variant) => [
      variant,
      () =>
        props.dispatch(
          splitByAction(
            props.metricId,
            props.restrictions,
            props.paramName,
            props.variants
          )
        ),
    ])
  );
  return (
    <ExecutablesDropdown
      text={text}
      variantsToExecutors={variantsToExecutors}
    />
  );
};
export const SplitByDropdown = connect()(_SplitByDropdown);
