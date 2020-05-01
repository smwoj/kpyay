import { Version } from "../models/Version";
import { Point } from "../models/Point";
import { paramsHash } from "../components/charts/calculate";

describe("Point", () => {
  it("correctly hashes params ", () => {
    const point = new Point(
      1.5,
      new Version(1, 2, 3),
      { team: "burgery", wege: "nie" },
      new Date("2012-04-14T00:02:00")
    );

    expect(paramsHash(point.params)).toEqual("team=burgery, wege=nie");
  });

  it("provides correct ordering", () => {
    // insignificant for the test
    const value = 1;
    const params = { ramen: "tonkotsu", eggs: "super-soft" };
    // //////////////////////////

    // timestamps are not in chronological order
    // this is just for testing purposes, it would be suspicious in real data
    const points: Point[] = [
      ["1.2.1", "2014-04-14"],
      ["1.12.1", "2012-03-10"],
      ["1.0.5", "2013-05-02"],
    ].map((pair) => {
      const [version, timestamp] = pair;
      return new Point(
        value,
        Version.parse(version),
        params,
        new Date(timestamp)
      );
    });

    const sortedByVersion = points
      .slice()
      .sort(Point.ascVersion)
      .map((p) => [
        p.version?.toString(),
        p.timestamp.toISOString().slice(0, 10),
      ]);
    const sortedByTimestamp = points
      .slice()
      .sort(Point.ascTimestamp)
      .map((p) => [
        p.version?.toString(),
        p.timestamp.toISOString().slice(0, 10),
      ]);

    expect(sortedByVersion).toEqual([
      ["1.0.5", "2013-05-02"],
      ["1.2.1", "2014-04-14"],
      ["1.12.1", "2012-03-10"],
    ]);
    expect(sortedByTimestamp).toEqual([
      ["1.12.1", "2012-03-10"],
      ["1.0.5", "2013-05-02"],
      ["1.2.1", "2014-04-14"],
    ]);
  });
});
