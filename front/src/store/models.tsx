import * as _ from "lodash";
//
// function dedup<T>(ts: T[]): T[] {
//   return _.uniqWith(ts, _.isEqual);
// }

export interface RawPoint {
  value: number;
  version: string | null;
  params: { [param: string]: string };
  timestamp: string;
  posted_ts: string;
}

export class Version {
  // simplified support for "0.2.4"-like versions (semver)
  readonly major: number;
  readonly minor: number;
  readonly bugfix: number;

  static parse(str: string): Version {
    const segments = str.split(".").map((x) => Number.parseInt(x, 10));
    if (segments.some(Number.isNaN)) {
      throw `str is broken: ${str}: part of it is not parseable as int`;
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
  readonly _posted_ts: Date;

  static fromRaw(rp: RawPoint): Point {
    const { value, version, params, timestamp, posted_ts } = rp;
    const parsed_version = version ? Version.parse(version) : null;

    return new this(
      value,
      parsed_version,
      params,
      new Date(timestamp),
      new Date(posted_ts)
    );
  }

  constructor(
    value: number,
    version: Version | null,
    params: { [param: string]: string },
    timestamp: Date,

    posted_ts: Date
  ) {
    this._value = value;
    this._version = version;
    this._params = params;
    this._timestamp = timestamp;
    this._posted_ts = posted_ts;
  }

  paramsHash(): string {
    return paramsHash(this._params);
  }

  static ascVersion(left: Point, right: Point): number {
    if (left._version && right._version) {
      return Version.ordAsc(left._version, right._version);
    } else {
      throw `cannot cmp points; at least one does not have a version. left: ${left}, right: ${right}`;
    }
  }

  static ascTimestamp(left: Point, right: Point): number {
    // sad workaround for https://github.com/microsoft/TypeScript/issues/5710
    return +left._timestamp - +right._timestamp;
  }
}

// export class ChartRestrictions {
//   readonly restrictions: { [param: string]: string };
//
//   static parse(str: string): ChartRestrictions {
//     const entries = str.split(",").map((pair) => [...pair.split("=")]);
//     return new this(Object.fromEntries(entries));
//   }
//
//   constructor(restrictions: { [param: string]: string }) {
//     this.restrictions = restrictions;
//   }
//
//   hash(): string {
//     return Object.entries(this.restrictions)
//       .map(([param, value]) => `${param}=${value}`)
//       .sort()
//       .join(", ");
//   }
// }
export type Restrictions = { [param: string]: string };

export interface AppState {
  cache: { [metricId: string]: Point[] };
  configs: { [metricId: string]: Restrictions[] };
  last_message: string;
}
