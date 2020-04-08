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

const hashParams = (params: { [param: string]: string }): string => {
    return Object.keys(params).sort().map((key: string) => {
        return `${key}=${params[key]}`;
    }).join(', ')
};

const toLine = (paramsHash: string, mps: metricPoint[]): JSX.Element => {
    return (
        <Line type="monotone" key={paramsHash} dataKey="value" stroke="red" data={mps}>
            <LabelList dataKey="version" position="insideTop"/>
            <XAxis dataKey="version" />
        </Line>
    );
};

export const Chart: React.FC<ChartProps> = (props: ChartProps) => {
    const strokes: Map<string, metricPoint[]> = new Map();

    props.data.forEach((mp) => {
        const hashedParams: string = hashParams(mp.params);
        const bucket = strokes.get(hashedParams);

        if (bucket === undefined) {
            strokes.set(hashedParams, [mp]);
        } else {
            bucket.push(mp);
        }
    });

    const lines: JSX.Element[] = [];
    strokes.forEach((mp, hashedParams) => {
        lines.push(toLine(hashedParams, mp));
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
