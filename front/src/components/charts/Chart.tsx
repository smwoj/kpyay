import * as React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import * as _ from "lodash";
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
  return (
    <div className="chart-title">
      <span className="chart-metric">{props.metricId}</span>
      <br />
      <span className="chart-params">{title}</span>
    </div>
  );
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
const calcXTicksInterval = (maxTicks: number): number => {
  // ad-hoc method to have xTicks in somewhat reasonable intervals
  // it's not number of ticks!
  return Math.floor(maxTicks / 12);
};

const _Chart = (
  props: {
    width: number;
    height: number;
    data: ChartData;
    spec: ChartSpec;
  } & { dispatch: (a: Action) => void }
) => {
  const { spec } = props;

  const selectDropdowns = Object.entries(
    props.data.paramsToVariants
  ).map(([param, variants]) => (
    <SelectDropdown
      key={param}
      paramName={param}
      variants={variants}
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
      spec={spec}
    />
  ));

  const lines = _.map(props.data.hashes, (hash, index) => {
    const colour = pickColour(index);
    return <Line key={hash} type="monotone" dataKey={hash} stroke={colour} />;
  });
  const legend = lines.length > 1 ? <Legend /> : null;
  return (
    <div className="chart-canvas">
      <Title
        metricId={spec.metricId}
        noChoiceParams={props.data.noChoiceParams}
      />
      <div className="config-buttons-div">
        <DeleteButton spec={spec} />
        <SwitchXAxisButton spec={spec} />
        {selectDropdowns}
        {splitByButtons}
      </div>
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
          interval={calcXTicksInterval(props.data.data.length)}
        />
        <YAxis
          type="number"
          // domain={[0.5, 1.1]}
          // not really happy with the default domain calculation,
          // but taking the 0% effort for 50% satisfaction trade-off
        />
        <CartesianGrid stroke="#eeeeee" strokeDasharray="5 5" />
        {lines}
        {legend}
        <Tooltip formatter={smartFormatter} />
      </LineChart>
    </div>
  );
};

export const Chart = connect()(_Chart);
