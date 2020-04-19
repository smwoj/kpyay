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
  SplitByDropdown,
  SelectDropdown,
} from "../viewConfig/chartButtons";
import { ChartData } from "./calculate";
import { connect } from "react-redux";
import { Action } from "redux";

const Title = (props: {
  metricId: string;
  noChoiceParams: { [param: string]: string };
}): JSX.Element => {
  let title_descr: string;
  if (Object.entries(props.noChoiceParams).length) {
    title_descr =
      " (" +
      Object.entries(props.noChoiceParams)
        .map(([param, value]) => `${param}=${value}`)
        .join(", ") +
      ")";
  } else {
    title_descr = "";
  }
  return <h1>{props.metricId + title_descr}</h1>;
};

const _Chart = (
  props: {
    width: number;
    height: number;
    data: ChartData;
    metricId: string;
    restrictions: { [param: string]: string };
  } & { dispatch: (a: Action) => void }
) => {
  const { metricId, restrictions } = props;

  const selectDropdowns = Object.entries(
    props.data.paramsToVariants
  ).map(([param, variants]) => (
    <SelectDropdown
      key={param}
      paramName={param}
      variants={variants}
      metricId={metricId}
      restrictions={restrictions}
    />
  ));

  const splitByDropdowns = Object.entries(
    props.data.paramsToVariants
  ).map(([param, variants]) => (
    <SplitByDropdown
      key={param}
      paramName={param}
      variants={variants}
      metricId={metricId}
      restrictions={restrictions}
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
        <DeleteButton metricId={metricId} restrictions={restrictions} />
        {selectDropdowns}
        {splitByDropdowns}
      </div>
      <div>
        <LineChart
          width={props.width}
          height={props.height}
          data={props.data.data}
        >
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="_version" height={50} tick={CustomizedAxisTick} />
          <YAxis type="number" domain={[0.5, 1.1]} />
          {/*TODO: ^^ calculate in calculate*/}
          <CartesianGrid stroke="#eeeeee" strokeDasharray="5 5" />
          {lines}
          {legend}
          <Tooltip />
        </LineChart>
      </div>
    </div>
  );
};

export const Chart = connect()(_Chart);
