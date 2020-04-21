import * as __ from "lodash";
import * as _ from "underscore";
import { DefaultDict } from "../../lib/collections/DefaultDict";
import { paramsHash, Point } from "../../models/Point";

type NoChoiceParams = { [param: string]: string };
type ParamVariants = { [param: string]: string[] };

export interface ChartData {
  readonly data: { [key: string]: number | string }[];
  readonly xAccessor: "version" | "timestamp";
  readonly hashes: string[];
  readonly noChoiceParams: NoChoiceParams;
  readonly paramsToVariants: ParamVariants;
}

export const partitionByVariants = (paramsToVariants: {
  [keys: string]: Set<string>;
}): [NoChoiceParams, ParamVariants] => {
  type Params = [string, Set<string>][];
  const [withOne, withMore]: [Params, Params] = __.partition(
    Object.entries(paramsToVariants),
    (keyVal) => {
      const [, values] = keyVal;
      return values.size === 1;
    }
  );
  const noChoice = _.object(
    _.map(withOne, (kvPair) => {
      const [param, variants] = kvPair;
      return [param, variants.values().next().value];
    })
  );
  const withVariants = _.object(
    _.map(withMore, (kvPair) => {
      const [param, variants] = kvPair;
      return [param, [...variants]];
    })
  );
  return [noChoice, withVariants];
};

export const calculate = (
  points: Point[],
  xAccessor: "version" | "timestamp"
): ChartData => {
  const groups = new DefaultDict<Point[]>(() => []);
  const group: (p: Point) => string | undefined =
    xAccessor === "version"
      ? (p: Point) => p._version?.toString()
      : (p: Point) => p._timestamp.toISOString().slice(0, 19).replace("T", " ");
  const variants = new DefaultDict<Set<string>>(() => new Set<string>());

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

  const hashes: Set<string> = new Set();
  points.forEach((p) => {
    hashes.add(relevantParamsHash(p));
  });
  const allValues = points.map((p) => p._value);
  return {
    data: __.map(groups.data, (ps, xacc) => {
      const data: any = _.object(
        ps.map((p) => [relevantParamsHash(p), p._value])
      );
      data[xAccessor] = xacc;
      return data;
    }),
    hashes: [...hashes],
    xAccessor,
    noChoiceParams,
    paramsToVariants,
  };
};
