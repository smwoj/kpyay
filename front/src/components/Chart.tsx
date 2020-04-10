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

export interface ChartProps {
  width: number;
  height: number;
  name: string;
  data: Point[];
}

const CustomizedAxisTick = (props: {
  x: number;
  y: number;
  payload: { value: string };
}) => {
  const { x, y, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#666"
        transform="rotate(-45)"
      >
        {payload.value}
      </text>
    </g>
  );
};

type ChartDataPoint = { [key: string]: number | string };
type ChartData = ChartDataPoint[];

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

  return (
    <div className="chartBox">
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
  );
};
