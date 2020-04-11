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
  GroupByDropdown,
  SelectDropdown,
} from "../viewConfig/chartButtons";
import { ChartData } from "./calculate";

export interface ChartProps {
  width: number;
  height: number;
  data: ChartData;
  deleteChart(selfId: string): void;
  select(selfId: string, restriction: string): void;
  groupBy(selfId: string, param: string): void;
}

const Title = (props: {
  metricId: string;
  noChoiceParams: { [param: string]: string };
}): JSX.Element => {
  let title_descr: string;
  if (Object.entries(props.noChoiceParams).length) {
    title_descr =
      "(" +
      Object.entries(props.noChoiceParams)
        .map(([param, value]) => `${param}=${value}`)
        .join(", ") +
      ")";
  } else {
    title_descr = "";
  }
  return <h1>{props.metricId + title_descr}</h1>;
};

export const Chart: React.FC<ChartProps> = (props: ChartProps) => {
  // TODO: hashes shouldn'y include withOne params.
  const lines = _.map(props.data.hashes, (hash, index) => {
    const colour = pickColour(index);
    return <Line key={hash} type="monotone" dataKey={hash} stroke={colour} />;
  });

  console.log(props.data.noChoiceParams, props.data.paramsToVariants);
  // const teamVariants = ["burgery", "wege"];
  const selfDelete = () => props.deleteChart("DUPA-ID");

  const selectDropdowns = Object.entries(
    props.data.paramsToVariants
  ).map(([param, variants]) => (
    <SelectDropdown
      key={param}
      paramName={param}
      variants={variants}
      select={(restriction) => props.select("MOJE MOCKOWE ID", restriction)}
    />
  ));
  const groupByDropdowns = Object.entries(
    props.data.paramsToVariants
  ).map(([param, variants]) => (
    <GroupByDropdown
      key={param}
      paramName={param}
      variants={variants}
      groupBy={(param) => props.groupBy("MOJE MOCKOWE ID", param)}
    />
  ));

  return (
    <div className="chartBox">
      <div className="chart-title-div">
        <Title
          metricId={props.data.config.metricId}
          noChoiceParams={props.data.noChoiceParams}
        />
      </div>
      <div id="config-buttons-div">
        <DeleteButton deleteCallback={selfDelete} />
        {selectDropdowns}
        {groupByDropdowns}
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
          <Legend />
          <Tooltip />
        </LineChart>
      </div>
    </div>
  );
};
