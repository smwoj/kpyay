import * as _ from "lodash";
import { DefaultDict } from "../../lib/collections/DefaultDict";
import { Point } from "../../models/Point";
import { Version } from "../../models/Version";

type NoChoiceParams = { [param: string]: string };
type ParamVariants = { [param: string]: string[] };

export interface ChartData {
  readonly data: { [key: string]: number | string }[];
  readonly xAccessor: "version" | "timestamp";
  readonly xAxisSwitchable: boolean;
  readonly hashes: string[];
  readonly noChoiceParams: NoChoiceParams;
  readonly paramsToVariants: ParamVariants;
}

export const partitionByVariants = (paramsToVariants: {
  [keys: string]: Set<string>;
}): [NoChoiceParams, ParamVariants] => {
  type Params = [string, Set<string>][];
  const [withOne, withMore]: [Params, Params] = _.partition(
    Object.entries(paramsToVariants),
    (keyVal) => {
      const [, values] = keyVal;
      return values.size === 1;
    }
  );
  const noChoice = _.fromPairs(
    _.map(withOne, (kvPair) => {
      const [param, variants] = kvPair;
      return [param, variants.values().next().value];
    })
  );
  const withVariants = _.fromPairs(
    _.map(withMore, (kvPair) => {
      const [param, variants] = kvPair;
      return [param, [...variants]];
    })
  );
  return [noChoice, withVariants];
};

export const paramsHash = (params: { [param: string]: string }): string => {
  return Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join(", ");
};

export const calculate = (
  points: Point[],
  xAccessor: "version" | "timestamp"
): ChartData => {
  const xAxisSwitchable = points.some((p) => p.version);

  const groups = new DefaultDict<Point[]>(() => []);
  const group: (p: Point) => string | undefined =
    xAccessor === "version"
      ? (p: Point) => p.version?.toString()
      : (p: Point) => p.timestamp.toISOString().slice(0, 19).replace("T", " ");
  const variants = new DefaultDict<Set<string>>(() => new Set<string>());

  points.forEach((p) => {
    if (group(p)) {
      groups.get(group(p) as string).push(p);
    }
    _.forEach(p.params, (value, param) => {
      variants.get(param).add(value);
    });
  });
  const [noChoiceParams, paramsToVariants] = partitionByVariants(variants.data);

  const relevantParamsHash = (p: Point): string => {
    const hashableParams = Object.entries(p.params).filter(([param, val]) =>
      paramsToVariants.hasOwnProperty(param)
    );
    return paramsHash(_.fromPairs(hashableParams));
  };

  const hashes: Set<string> = new Set();
  points.forEach((p) => {
    hashes.add(relevantParamsHash(p));
  });
  const transformedGroups = _.map(groups.data, (ps, accessorValue) => {
    const data: any = _.fromPairs(
      ps.map((p) => [relevantParamsHash(p), p.value])
    );
    data[xAccessor] = accessorValue;
    return data;
  });
  const sortedGroups = transformedGroups.sort((grA, grB) => {
    if (xAccessor === "version") {
      return Version.ordAsc(
        Version.parse(grA.version),
        Version.parse(grB.version)
      );
    } else {
      return +Date.parse(grA.timestamp) - +Date.parse(grB.timestamp);
    }
  });

  return {
    data: sortedGroups,
    hashes: [...hashes],
    xAccessor,
    xAxisSwitchable,
    noChoiceParams,
    paramsToVariants,
  };
};
