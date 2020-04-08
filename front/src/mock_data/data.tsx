const fs = require('fs');
import {metricPoint} from '../store/models'

export const parsePoints: metricPoint[] = (json: string) => {
    JSON.parse(json).map
};

export const DOGS_VS_MUFFINS_FSCORES: metricPoint[] = fs.readFileSync('./dogs_muffins_classifiers.json');
export const SLOTHS_VS_PASTRY_FSCORES: metricPoint[] = fs.readFileSync();
