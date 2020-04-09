import {metricPoint} from '../store/models'
import {SLOTHS_PASTRY_POINTS} from './sloths_pastry_classifiers'
import {DOGS_MUFFINS_POINTS} from './dogs_muffins_classifiers'

export interface RawPoint {
    value: number,
    version?: string,
    params: { [param: string]: string }
    timestamp: string,
    posted_ts: string,
}

const rawPointToMetric = (rp: RawPoint): metricPoint => {
    const timestamp: Date = new Date(rp.timestamp);
    return {...rp, posted_ts: new Date(rp.posted_ts), timestamp};
};

export const SLOTHS_VS_PASTRY_FSCORES: metricPoint[] = SLOTHS_PASTRY_POINTS.map(rawPointToMetric);
export const DOGS_VS_MUFFINS_FSCORES: metricPoint[] = DOGS_MUFFINS_POINTS.map(rawPointToMetric);
