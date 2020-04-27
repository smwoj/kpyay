//mock impl - real api calls are waiting for server implementation
import { BFSet } from "../../lib/collections/BFSet";
import { ChartSpec } from "../../store/models";

const viewsRepo: { [viewName: string]: BFSet<ChartSpec> } = {
  v1: new BFSet([
    {
      xAccessor: "timestamp",
      metricId: "beta",
      restrictions: {},
    },
  ] as ChartSpec[]),
  lotsa: new BFSet<ChartSpec>([
    {
      metricId: "gamma",
      restrictions: { classifier: "random-forest", team: "echo" },
      xAccessor: "timestamp",
    },
    {
      metricId: "gamma",
      restrictions: { classifier: "random-forest", team: "foxtrot" },
      xAccessor: "timestamp",
    },
    {
      metricId: "gamma",
      restrictions: { classifier: "random-forest", team: "lima" },
      xAccessor: "timestamp",
    },
    {
      metricId: "gamma",
      restrictions: { classifier: "cnn-gamma", team: "echo" },
      xAccessor: "timestamp",
    },
    {
      metricId: "gamma",
      restrictions: { classifier: "cnn-gamma", team: "foxtrot" },
      xAccessor: "timestamp",
    },
    {
      metricId: "gamma",
      restrictions: { classifier: "cnn-gamma", team: "lima" },
      xAccessor: "timestamp",
    },
    {
      metricId: "gamma",
      restrictions: { classifier: "cnn-eta", team: "echo" },
      xAccessor: "timestamp",
    },
    {
      metricId: "gamma",
      restrictions: { classifier: "cnn-eta", team: "foxtrot" },
      xAccessor: "timestamp",
    },
    {
      metricId: "gamma",
      restrictions: { classifier: "cnn-eta", team: "lima" },
      xAccessor: "timestamp",
    },
  ]),
};

export async function saveView(
  viewName: string,
  config: BFSet<ChartSpec>
): Promise<void> {
  viewsRepo[viewName] = config;
}

export async function loadView(viewName: string): Promise<BFSet<ChartSpec>> {
  const config = viewsRepo[viewName];
  if (!config) {
    return Promise.reject(
      new Error(
        `No view named ${viewName}. Available views: ${Object.keys(viewsRepo)}`
      )
    );
  } else {
    return Promise.resolve(config);
  }
}
