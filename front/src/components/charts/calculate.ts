import { Point } from "../../store/models";
import * as __ from "lodash";
import * as _ from "underscore";

interface ChartConfig {
  readonly metricId: string;
  readonly filters: { [param: string]: string }[];
  readonly xAccessor: "version" | "timestamp";
}

type NoChoiceParams = { [param: string]: string };
type ParamVariants = { [param: string]: string[] };

export interface ChartData {
  readonly data: { [key: string]: number | string }[];
  readonly hashes: string[];
  readonly config: ChartConfig;
  readonly noChoiceParams: NoChoiceParams;
  readonly paramsToVariants: ParamVariants;
}

export class DefaultDict<T> {
  data: { [keys: string]: T };
  init: () => T;

  constructor(defaultInit: () => T) {
    this.data = {};
    this.init = defaultInit;
  }

  get(key: string): T {
    if (!(key in this.data)) {
      this.data[key] = this.init();
    }
    return this.data[key];
  }
}

export const partitionByVariants = (paramsToVariants: {
  [keys: string]: Set<string>;
}): [NoChoiceParams, ParamVariants] => {
  type Params = [string, Set<string>][];
  const [withOne, withMore]: [Params, Params] = __.partition(
    Object.entries(paramsToVariants),
    (key_val) => {
      const [, values] = key_val;
      return values.size == 1;
    }
  );
  const noChoice = _.object(
    _.map(withOne, (kv_pair) => {
      const [param, variants] = kv_pair;
      return [param, variants.values().next().value];
    })
  );
  const variants = _.object(
    _.map(withMore, (kv_pair) => {
      const [param, variants] = kv_pair;
      return [param, [...variants.values()]];
    })
  );
  return [noChoice, variants];
};

export const calculate = (points: Point[], config: ChartConfig): ChartData => {
  let groups = new DefaultDict<Point[]>(() => []);
  let group: (p: Point) => string | undefined =
    config.xAccessor === "version"
      ? (p: Point) => p._version?.toString()
      : (p: Point) => p._timestamp.toISOString();
  let hashes: Set<string> = new Set();
  let variants = new DefaultDict<Set<string>>(() => new Set<string>());

  points.forEach((p) => {
    if (group(p)) {
      groups.get(group(p) as string).push(p);
    }
    hashes.add(p.paramsHash());
    _.forEach(p._params, (value, param) => {
      variants.get(param).add(value);
    });
  });
  const [noChoiceParams, paramsToVariants] = partitionByVariants(variants.data);

  return {
    data: __.map(groups.data, (ps, version) => {
      let data: any = _.object(ps.map((p) => [p.paramsHash(), p._value]));
      data["_version"] = version;
      return data;
    }),
    hashes: [...hashes],
    config,
    noChoiceParams,
    paramsToVariants,
  };
};
