export interface metricPoint {
    value: number,
    version?: string,
    params: { [param: string]: string }
    timestamp: Date,
    posted_ts: Date,
}

export interface AppState {
    chartsData: { [metricId: string]: metricPoint[] },
}
