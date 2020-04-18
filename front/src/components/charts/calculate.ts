import { Point, paramsHash } from "../../store/models";
import * as __ from "lodash";
import * as _ from "underscore";

// export interface ChartConfig {
//   readonly metricId: string;
//   readonly filters: { [param: string]: string };
//   readonly xAccessor: "version" | "timestamp";
// }

type NoChoiceParams = { [param: string]: string };
type ParamVariants = { [param: string]: string[] };

export interface ChartData {
  readonly data: { [key: string]: number | string }[];
  readonly xAccessor: "version" | "timestamp";
  readonly hashes: string[];
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
// todo: gdzieś wcześniej ściągnąć punkty z cache i przefiltrować
export const calculate = (
  points: Point[],
  xAccessor: "version" | "timestamp"
): ChartData => {
  let groups = new DefaultDict<Point[]>(() => []);
  let group: (p: Point) => string | undefined =
    xAccessor === "version"
      ? (p: Point) => p._version?.toString()
      : (p: Point) => p._timestamp.toISOString();
  let variants = new DefaultDict<Set<string>>(() => new Set<string>());

  points.forEach((p) => {
    if (group(p)) {
      groups.get(group(p) as string).push(p);
    }
    _.forEach(p._params, (value, param) => {
      variants.get(param).add(value);
    });
  });
  const [noChoiceParams, paramsToVariants] = partitionByVariants(variants.data);

  const relevantParamsHash = (p: Point): string => {
    const hashableParams = Object.entries(p._params).filter(([param, val]) =>
      paramsToVariants.hasOwnProperty(param)
    );
    return paramsHash(_.object(hashableParams));
  };

  let hashes: Set<string> = new Set();
  points.forEach((p) => {
    hashes.add(relevantParamsHash(p));
  });

  return {
    data: __.map(groups.data, (ps, version) => {
      let data: any = _.object(
        ps.map((p) => [relevantParamsHash(p), p._value])
      );
      data["_version"] = version; // co z tajmstampami? TODO
      return data;
    }),
    hashes: [...hashes],
    xAccessor,
    noChoiceParams,
    paramsToVariants,
  };
};
