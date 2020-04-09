import * as React from "react";
import {CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
import {Point, Version} from "../store/models";
import * as _ from "underscore";


export interface ChartProps {
    width: number,
    height: number,
    name: string,
    data: Point[],
}


const toLine = (paramsHash: string, mps: Point[]): JSX.Element => {
    return (
        <Line type="monotone" key={paramsHash} dataKey="value" stroke="red" data={mps}>
            {/*<LabelList dataKey="version" position="insideTop"/>*/}
            {/*<XAxis dataKey={(mp: metricPoint) => mp.timestamp.toISOString()} />*/}
        </Line>
    );
};


const CustomizedAxisTick = (props) => {
    const {x, y, payload} = props;
    return (
        <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-45)">
                {payload.value}
            </text>
        </g>
    );
};

type ChartDataPoint = { version: string, values: { [paramsHash: string]: number } };
type ChartData = ChartDataPoint[];

export const Chart: React.FC<ChartProps> = (props: ChartProps) => {
    const pointsByVersion = _.groupBy(props.data, p => p._version?.toString());  // one key may be null
    const data: ChartData = _.map(pointsByVersion, (ps, version) => {
        return {
            version: version,
            values: _.object(ps.map(p => [p.paramsHash(), p._value])),
        };
    });

    const hashes = _.uniq(_.map(props.data, p => p.paramsHash()), false);
    const lines = _.map(hashes, hash => (
            <Line key={hash} type="monotone" dataKey={(dp: ChartDataPoint)=> dp.values[hash]} stroke="#8884d8"/>
        )
    );

    return <div className="chartBox">
        <LineChart
            width={props.width}
            height={props.height}
            data={data}
        >
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
            <XAxis
                dataKey="version"
                height={50}
                tick={<CustomizedAxisTick/>}
            />
            <YAxis type="number" domain={[0.5, 1.1]}/>
            <CartesianGrid stroke="#eeeeee" strokeDasharray="5 5"/>
            {lines}
            <Tooltip/>
        </LineChart>
    </div>
};
