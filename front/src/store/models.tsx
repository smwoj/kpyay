export interface metricPoint {
    value: number,
    version?: string,
}

export interface ChartData {
    metricId: string,
    points: metricPoint[],
}

// type viewDef = {
//   filters: [[string, string]]
//
// };
export interface AppState {
    chartsData: { [key: string]: ChartData },
// viewDefs: [viewDef],
};
