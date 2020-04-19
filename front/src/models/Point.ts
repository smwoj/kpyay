import { Version } from "./Version";
import { RawPoint } from "../store/models";

export const paramsHash = (params: { [param: string]: string }): string => {
  return Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join(", ");
};

export class Point {
  readonly _value: number;
  readonly _version: Version | null;
  readonly _params: { [param: string]: string };
  readonly _timestamp: Date;
  readonly _postedTimestamp: Date;

  static fromRaw(rp: RawPoint): Point {
    const { value, version, params, timestamp, postedTimestamp } = rp;
    const parsedVersion = version ? Version.parse(version) : null;

    return new this(
      value,
      parsedVersion,
      params,
      new Date(timestamp),
      new Date(postedTimestamp)
    );
  }

  constructor(
    value: number,
    version: Version | null,
    params: { [param: string]: string },
    timestamp: Date,
    postedTimestamp: Date
  ) {
    this._value = value;
    this._version = version;
    this._params = params;
    this._timestamp = timestamp;
    this._postedTimestamp = postedTimestamp;
  }

  paramsHash(): string {
    return paramsHash(this._params);
  }

  static ascVersion(left: Point, right: Point): number {
    if (left._version && right._version) {
      return Version.ordAsc(left._version, right._version);
    } else {
      throw new Error(
        `cannot cmp points; at least one does not have a version. left: ${left}, right: ${right}`
      );
    }
  }

  static ascTimestamp(left: Point, right: Point): number {
    // sad workaround for https://github.com/microsoft/TypeScript/issues/5710
    return +left._timestamp - +right._timestamp;
  }
}
