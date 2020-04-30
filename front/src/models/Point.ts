import { Version } from "./Version";
import { ResponsePoint } from "../backendApi";

export class Point {
  readonly value: number;
  readonly version: Version | null;
  readonly params: { [param: string]: string };
  readonly timestamp: Date;

  static fromResponse(rp: ResponsePoint): Point {
    const { value, version, params, timestamp } = rp;
    const parsedVersion = version ? new Version(...version) : null;

    return new this(value, parsedVersion, params, new Date(timestamp));
  }

  constructor(
    value: number,
    version: Version | null,
    params: { [param: string]: string },
    timestamp: Date
  ) {
    this.value = value;
    this.version = version;
    this.params = params;
    this.timestamp = timestamp;
  }

  static ascVersion(left: Point, right: Point): number {
    if (left.version && right.version) {
      return Version.ordAsc(left.version, right.version);
    } else {
      throw new Error(
        `cannot cmp points; at least one does not have a version. left: ${left}, right: ${right}`
      );
    }
  }

  static ascTimestamp(left: Point, right: Point): number {
    // sad workaround for https://github.com/microsoft/TypeScript/issues/5710
    return +left.timestamp - +right.timestamp;
  }
}
