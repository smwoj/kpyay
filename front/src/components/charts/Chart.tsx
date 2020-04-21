import * as React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import * as _ from "underscore";
import { pickColour } from "../../lib/colourPicker";
import { CustomizedAxisTick } from "./AxisTick";
import {
  DeleteButton,
  SplitByButton,
  SelectDropdown,
  SwitchXAxisButton,
} from "../viewConfig/chartButtons";
import { ChartData } from "./calculate";
import { connect } from "react-redux";
import { Action } from "redux";
import { ChartSpec } from "../../store/models";

const Title = (props: {
  metricId: string;
  noChoiceParams: { [param: string]: string };
}): JSX.Element => {
  let title: string;
  if (Object.entries(props.noChoiceParams).length) {
    title =
      " (" +
      Object.entries(props.noChoiceParams)
        .map(([param, value]) => `${param}=${value}`)
        .join(", ") +
      ")";
  } else {
    title = "";
  }
  return <h1>{props.metricId + title}</h1>;
};

const smartFormatter = (fullValue: number, name: string) => {
  const value = fullValue.toFixed(3);
  if (name === "") {
    //  replaces ugly tooltip ': 0.9234234234' for charts with empty data key (only 1 line)
    return [value];
  } else {
    return [`${name}: ${value}`];
  }
};

const _Chart = (
  props: {
    width: number;
    height: number;
    data: ChartData;
    metricId: string;
    spec: ChartSpec;
  } & { dispatch: (a: Action) => void }
) => {
  const { metricId, spec } = props;

  const selectDropdowns = Object.entries(
    props.data.paramsToVariants
  ).map(([param, variants]) => (
    <SelectDropdown
      key={param}
      paramName={param}
      variants={variants}
      metricId={metricId}
      spec={spec}
    />
  ));

  const splitByButtons = Object.entries(
    props.data.paramsToVariants
  ).map(([param, variants]) => (
    <SplitByButton
      key={param}
      paramName={param}
      variants={variants}
      metricId={metricId}
      spec={spec}
    />
  ));

  const lines = _.map(props.data.hashes, (hash, index) => {
    const colour = pickColour(index);
    return <Line key={hash} type="monotone" dataKey={hash} stroke={colour} />;
  });
  const legend = lines.length > 1 ? <Legend /> : null;
  return (
    <div className="chartBox">
      <div className="chart-title-div">
        <Title metricId={metricId} noChoiceParams={props.data.noChoiceParams} />
      </div>
      <div id="config-buttons-div">
        <DeleteButton metricId={metricId} spec={spec} />
        <SwitchXAxisButton metricId={metricId} spec={spec} />
        {selectDropdowns}
        {splitByButtons}
      </div>
      <div>
        <LineChart
          width={props.width}
          height={props.height}
          data={props.data.data}
        >
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis
            dataKey={spec.xAccessor}
            height={50}
            tick={CustomizedAxisTick}
            tickSize={3}
            interval={2}
          />
          {/*  TODO: cwanie policz interval żeby zawsze było 5-10 ticków*/}
          {/*  TODO: y range policz */}
          <YAxis type="number" domain={[0.5, 1.1]} />
          {/*TODO: ^^ calculate in calculate*/}
          <CartesianGrid stroke="#eeeeee" strokeDasharray="5 5" />
          {lines}
          {legend}
          <Tooltip formatter={smartFormatter} />
        </LineChart>
      </div>
    </div>
  );
};

export const Chart = connect()(_Chart);
