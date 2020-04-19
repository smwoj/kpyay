import { DefaultDict } from "../lib/collections/DefaultDict";
import { BFSet } from "../lib/collections/BFSet";

export interface RawPoint {
  value: number;
  version: string | null;
  params: { [param: string]: string };
  timestamp: string;
  postedTimestamp: string;
}

export class Version {
  // simplified support for "0.2.4"-like versions (semver)
  readonly major: number;
  readonly minor: number;
  readonly bugfix: number;

  static parse(str: string): Version {
    const segments = str.split(".").map((x) => Number.parseInt(x, 10));
    if (segments.some(Number.isNaN)) {
      throw new Error(
        `str is broken: ${str}: part of it is not parseable as int`
      );
    }
    return new this(segments[0], segments[1], segments[2]);
  }

  constructor(major: number, minor: number, bugfix: number) {
    this.major = major;
    this.minor = minor;
    this.bugfix = bugfix;
  }

  static ordAsc(left: Version, right: Version): number {
    if (left.major !== right.major) {
      return left.major - right.major;
    } else if (left.minor !== right.minor) {
      return left.minor - right.minor;
    } else {
      return left.bugfix - right.bugfix;
    }
  }

  static ordDesc(left: Version, right: Version): number {
    return -Version.ordAsc(left, right);
  }

  toString(): string {
    return `${this.major}.${this.minor}.${this.bugfix}`;
  }
}

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

export type Restrictions = { [param: string]: string };

export interface AppState {
  cache: { [metricId: string]: Point[] };
  // configs: { [metricId: string]: BFSet<Restrictions> };
  configs: DefaultDict<BFSet<Restrictions>>;
  last_message: string;
}
