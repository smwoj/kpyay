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
import { Point } from "../store/models";
import * as _ from "underscore";
import { pickColour } from "../lib/colourPicker";
import { CustomizedAxisTick } from "./charts/AxisTick";
import {
  DeleteButton,
  GroupByDropdown,
  SelectDropdown,
} from "./viewConfig/chartButtons";

export interface ChartProps {
  width: number;
  height: number;
  name: string;
  data: Point[];
  deleteChart(selfId: string): void;
  select(selfId: string, restriction: string): void;
  groupBy(selfId: string, param: string): void;
}

type ChartData = { [key: string]: number | string }[];

export const Chart: React.FC<ChartProps> = (props: ChartProps) => {
  const pointsByVersion = _.groupBy(props.data, (p) => p._version?.toString()); // one key may be null
  const data: ChartData = _.map(pointsByVersion, (ps, version) => {
    let data: any = _.object(ps.map((p) => [p.paramsHash(), p._value]));
    data["_version"] = version;
    return data;
  });

  const hashes = _.uniq(
    _.map(props.data, (p) => p.paramsHash()),
    false
  );
  const lines = _.map(hashes, (hash, index) => {
    const colour = pickColour(index);
    return <Line key={hash} type="monotone" dataKey={hash} stroke={colour} />;
  });

  const teamVariants = ["burgery", "wege"];
  const selfDelete = () => props.deleteChart("DUPA-ID");

  return (
    <div className="chartBox">
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
        <LineChart width={props.width} height={props.height} data={data}>
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
