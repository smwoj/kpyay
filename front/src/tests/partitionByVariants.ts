import { partitionByVariants } from "../components/charts/calculate";

describe("partitionByVariants", () => {
  it("partitions correctly ", () => {
    const data = {
      a: new Set(["a", "b"]),
      b: new Set(["c", "d", "xD", "Xd"]),
      c: new Set(["XD"]),
      d: new Set(["fff"]),
    };
    const [withOne, withMany] = partitionByVariants(data);
    expect(withMany).toEqual({
      a: ["a", "b"],
      b: ["c", "d", "xD", "Xd"],
    });
    expect(withOne).toEqual({
      c: "XD",
      d: "fff",
    });
  });
});
