import * as React from "react";
import {CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
import {metricPoint} from "../store/models";
import Any = jasmine.Any;

// import * as _ from 'underscore'

export interface ChartProps {
    width: number,
    height: number,
    name: string,
    data: metricPoint[],
}

const hashParams = (params: { [param: string]: string }): string => {
    return Object.keys(params).sort().map((key: string) => {
        return `${key}=${params[key]}`;
    }).join(', ')
};

const toLine = (paramsHash: string, mps: metricPoint[]): JSX.Element => {
    // console.log(mps);
    return (
        <Line type="monotone" key={paramsHash} dataKey="value" stroke="red" data={mps}>
            {/*<LabelList dataKey="version" position="insideTop"/>*/}
            {/*<XAxis dataKey={(mp: metricPoint) => mp.timestamp.toISOString()} />*/}
        </Line>
    );
};
const timestampOrd = (p1: metricPoint, p2: metricPoint): number => {
    // wtf, https://github.com/microsoft/TypeScript/issues/5710
    return (+p1.timestamp) - (+p2.timestamp);
};

// const versionOrd = (p1: metricPoint, p2: metricPoint): number => {
//     // wtf, https://github.com/microsoft/TypeScript/issues/5710
//     return (+p1.timestamp) - (+p2.timestamp);
// };
//
// // class VersionData {
//     readonly _version: string;
//
//     // TODO: assert the same paramsHash
//     static fromPoints(mps: metricPoint[]): VersionData {
//         return new this(
//
//         )
//     }
//
//     constructor (version: string, ) {
//         this._version = version;
//         this._sfdfsdf
//     }
//     // values: {[hashedParams: string]: number},
// }


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

export const Chart: React.FC<ChartProps> = (props: ChartProps) => {
    const strokes: Map<string, metricPoint[]> = new Map();

    props.data.slice().sort(timestampOrd).forEach((mp) => {
        const hashedParams: string = hashParams(mp.params);
        const bucket = strokes.get(hashedParams);

        if (bucket === undefined) {
            strokes.set(hashedParams, [mp]);
        } else {
            bucket.push(mp);
        }
    });

    const lines: JSX.Element[] = [];
    strokes.forEach((mps, hashedParams) => {
        lines.push(toLine(hashedParams, mps));
    });

    return <div className="chartBox">
        <LineChart
            width={props.width}
            height={props.height}
            data={props.data}>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
            <XAxis
                // dataKey={(mp) => fmtDate(mp.timestamp)}
                dataKey="version"
                height={50}
                tick={<CustomizedAxisTick />}
            />
            <YAxis type="number" domain={[0.5, 1.1]}/>
            <CartesianGrid stroke="#eeeeee" strokeDasharray="5 5"/>
            {lines}
            <Tooltip></Tooltip>
        </LineChart>
    </div>
};
