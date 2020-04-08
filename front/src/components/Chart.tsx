import * as React from "react";
import {LabelList, CartesianGrid, Line, LineChart, XAxis, YAxis} from "recharts";
import {metricPoint} from "../store/models";

// import * as _ from 'underscore'

export interface ChartProps {
    width: number,
    height: number,
    name: string,
    data: metricPoint[],
}

const hash_params = (params: { [param: string]: string }): string => {
    return Object.keys(params).sort().map((key: string) => {
        return `${key}=${params[key]}`;
    }).join(', ')
};

const toLine = (params_hash: string, mps: metricPoint[]): JSX.Element => {
    return (
        <Line type="monotone" dataKey="uv" stroke="red  ">
            <LabelList dataKey="version" position="insideTop"/>
        </Line>
    );
};

export const Chart: React.FC<ChartProps> = (props: ChartProps) => {
    let strokes: Map<string, metricPoint[]> = new Map();

    // todo - make a nice defaultdict / groupingMap as a library collection
    props.data.forEach((mp) => {
        const hashed_params: string = hash_params(mp.params);
        const bucket = strokes.get(hashed_params);
        if (bucket == undefined) {
            strokes.set(hashed_params, [mp]);
        } else {
            bucket.push(mp);
        }
    });
    const lines: JSX.Element[] = [];
    strokes.forEach((mp, hashed_params) => {
        lines.push(toLine(hashed_params, mp));
    });


    return <div className="chartBox">
        <LineChart width={props.width} height={props.height} data={props.data}>
            <XAxis dataKey="name"/>
            <YAxis/>
            <CartesianGrid stroke="#eeeeee" strokeDasharray="5 5"/>
            {lines}
        </LineChart>
    </div>
};
