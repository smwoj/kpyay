import { Point } from "./models/Point";
import axios from "axios";
import { BFSet } from "./lib/collections/BFSet";
import { ChartSpec } from "./store/models";
import stringify from "json-stable-stringify";

const BACKEND_URL = "http://127.0.0.1:8088";

export async function getMetricData(metricId: string): Promise<Point[]> {
  const response = await axios.get(`${BACKEND_URL}/points/${metricId}`);
  console.log(`getMetricData() -> ${stringify(response.data)}`);
  return response.data;
}

export async function saveView(
  viewName: string,
  config: BFSet<ChartSpec>
): Promise<void> {
  return await axios.post(`${BACKEND_URL}/views/${viewName}`, config._items);
}

interface ViewResponse {
  metric_id: string;
  restrictions: { [param: string]: string };
  x_accessor: string;
}
export async function loadView(viewName: string): Promise<BFSet<ChartSpec>> {
  const response = await axios.get(`${BACKEND_URL}/views/${viewName}`);
  console.log(`axios response content = ${stringify(response.data)}`);
  const data = response.data.map((elem: ViewResponse) => {
    return {
      metricId: elem.metric_id,
      restrictions: elem.restrictions,
      xAccessor: elem.x_accessor,
    };
  });
  return new BFSet<ChartSpec>(data);
}
