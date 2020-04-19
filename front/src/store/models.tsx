import { DefaultDict } from "../lib/collections/DefaultDict";
import { BFSet } from "../lib/collections/BFSet";
import { Point } from "../models/Point";

export interface RawPoint {
  value: number;
  version: string | null;
  params: { [param: string]: string };
  timestamp: string;
  postedTimestamp: string;
}

export type Restrictions = { [param: string]: string };

export interface AppState {
  cache: { [metricId: string]: Point[] };
  // configs: { [metricId: string]: BFSet<Restrictions> };
  configs: DefaultDict<BFSet<Restrictions>>;
  last_message: string;
}
