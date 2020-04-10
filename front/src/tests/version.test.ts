import { Version } from "../store/models";

describe("Version", () => {
  it("provides access to version segments", () => {
    const version = new Version(1, 2, 3);

    expect(version).toHaveProperty("major", 1);
    expect(version).toHaveProperty("minor", 2);
    expect(version).toHaveProperty("bugfix", 3);
  });

  it("is parseable from string", () => {
    const version = Version.parse("1.12.9");

    expect(version).toHaveProperty("major", 1);
    expect(version).toHaveProperty("minor", 12);
    expect(version).toHaveProperty("bugfix", 9);
  });

  it("is parseable from another string", () => {
    const version = Version.parse("0.12122.931");

    expect(version).toHaveProperty("major", 0);
    expect(version).toHaveProperty("minor", 12122);
    expect(version).toHaveProperty("bugfix", 931);
  });

  it("is nicely sortable", () => {
    const versions = ["1.12.1", "1.2.3", "1.9.0", "1.12.0", "1.2.0"].map((x) =>
      Version.parse(x)
    );

    const ascVersions = [
      "1.2.0",
      "1.2.3",
      "1.9.0",
      "1.12.0",
      "1.12.1",
    ].map((x) => Version.parse(x));
    const descVersions = ascVersions.slice().reverse();

    const sortedAsc = versions.slice().sort(Version.ordAsc);
    const sortedDesc = versions.slice().sort(Version.ordDesc);

    expect(sortedAsc).toEqual(ascVersions);
    expect(sortedDesc).toEqual(descVersions);
  });
});
