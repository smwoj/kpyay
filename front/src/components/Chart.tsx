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
import { pickColour } from "../lib/colourPicker";
import { CustomizedAxisTick } from "./charts/AxisTick";
import {
  DeleteButton,
  GroupByDropdown,
  SelectDropdown,
} from "./viewConfig/chartButtons";
import { ChartData } from "./charts/calculate";

export interface ChartProps {
  width: number;
  height: number;
  data: ChartData;
  deleteChart(selfId: string): void;
  select(selfId: string, restriction: string): void;
  groupBy(selfId: string, param: string): void;
}

export const Chart: React.FC<ChartProps> = (props: ChartProps) => {
  const lines = _.map(props.data.hashes, (hash, index) => {
    const colour = pickColour(index);
    return <Line key={hash} type="monotone" dataKey={hash} stroke={colour} />;
  });

  const teamVariants = ["burgery", "wege"];
  const selfDelete = () => props.deleteChart("DUPA-ID");

  return (
    <div className="chartBox">
      {/*TODO extract title and dropdowns into separate component */}
      <div>
        <DeleteButton deleteCallback={selfDelete} />
        <SelectDropdown
          paramName="team"
          variants={teamVariants}
          select={(restriction) => props.select("MOJE MOCKOWE ID", restriction)}
        />
        <GroupByDropdown
          paramName="team"
          variants={teamVariants}
          groupBy={(param) => props.groupBy("MOJE MOCKOWE ID", param)}
        />
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
          <CartesianGrid stroke="#eeeeee" strokeDasharray="5 5" />
          {lines}
          <Legend />
          <Tooltip />
        </LineChart>
      </div>
    </div>
  );
};
