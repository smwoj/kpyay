//mock impl - real api calls are waiting for server implementation
import { BFSet } from "../../lib/collections/BFSet";
import { ChartSpec } from "../../store/models";
import stringify from "json-stable-stringify";

export async function saveView(
  viewName: string,
  config: BFSet<ChartSpec>
): Promise<void> {
  if (viewName.startsWith("a")) {
    const msg = `'${viewName}' is not a good view name, pick something else`;
    console.log(msg);
    return Promise.reject(new Error(msg));
  } else {
    console.log(
      `OK, saved view '${viewName}' with config: ${stringify(config)}`
    );
    return Promise.resolve();
  }
}

const viewsRepo: { [viewName: string]: BFSet<ChartSpec> } = {
  v1: new BFSet([
    {
      xAccessor: "timestamp",
      metricId: "beta",
      restrictions: { team: "foxtrot" },
    },
    {
      xAccessor: "version",
      metricId: "beta",
      restrictions: { team: "echo" },
    },
  ] as ChartSpec[]),
};

export async function loadView(viewName: string): Promise<BFSet<ChartSpec>> {
  const config = viewsRepo[viewName];
  if (!config) {
    return Promise.reject(
      new Error(
        `No view named ${viewName}. ` +
          `Available views: ${Object.keys(viewsRepo)}` // debug
      )
    );
  } else {
    return Promise.resolve(config);
  }
}