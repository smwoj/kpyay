import { BFSet } from "../lib/collections/BFSet";
import { Point } from "../models/Point";

export type ChartSpec = {
  metricId: string;
  xAccessor: "timestamp" | "version";
  restrictions: { [param: string]: string };
};

export interface AppState {
  showConfigButtons: boolean;
  viewName: string | null;
  cache: { [metricId: string]: Point[] };
  configs: BFSet<ChartSpec>;
  last_message: string;
}
