import { BFSet } from "../lib/collections/BFSet";
import { Point } from "../models/Point";

export interface RawPoint {
  value: number;
  version: string | null;
  params: { [param: string]: string };
  timestamp: string;
  postedTimestamp: string;
}

export type ChartSpec = {
  metricId: string;
  xAccessor: "timestamp" | "version";
  restrictions: { [param: string]: string };
};

export interface AppState {
  viewName: string | null;
  cache: { [metricId: string]: Point[] };
  configs: BFSet<ChartSpec>;
  last_message: string;
}
