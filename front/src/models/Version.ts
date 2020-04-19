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
