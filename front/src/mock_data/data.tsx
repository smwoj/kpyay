const fs = require('fs');
import {metricPoint} from '../store/models'

export interface rawPoint {
    value: number,
    version?: string,
    params: { [param: string]: string }
    timestamp?: string,
    posted_ts: string,
}

export const parsePoints = (json: string): metricPoint[] => {
    const objs: rawPoint[] = JSON.parse(json);
    return objs.map((point) => {
        const timestamp: Date | undefined = point.timestamp ? new Date(point.timestamp) : undefined;
        return {...point, posted_ts: new Date(point.posted_ts), timestamp};
    });
};

export const DOGS_VS_MUFFINS_FSCORES: metricPoint[] = parsePoints(
    fs.readFileSync('./dogs_muffins_classifiers.json')
);
export const SLOTHS_VS_PASTRY_FSCORES: metricPoint[] = parsePoints(
    fs.readFileSync('./sloths_pastry_classifiers.json')
);
