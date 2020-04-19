import { DefaultDict } from "../lib/collections/DefaultDict";

describe("DefaultDict", () => {
  it("does its thing for arrays", () => {
    const dd = new DefaultDict<number[]>(() => []);
    const pairs: [string, number][] = [
      ["a", 1],
      ["b", 2],
      ["a", 3],
    ];
    for (let pair of pairs) {
      const [k, v] = pair;
      dd.get(k).push(v);
    }

    expect(dd.data).toEqual({
      a: [1, 3],
      b: [2],
    });
  });

  it("does its thing for sets", () => {
    const dd = new DefaultDict<Set<string>>(() => new Set());
    const pairs: [string, string][] = [
      ["a", "alfa"],
      ["b", "beta"],
      ["a", "alpaka"],
    ];
    for (let pair of pairs) {
      const [k, v] = pair;
      dd.get(k).add(v);
    }

    expect(dd.data).toEqual({
      a: new Set(["alfa", "alpaka"]),
      b: new Set(["beta"]),
    });
  });

  it("spreads like butter", () => {
    const dd = new DefaultDict<string[]>(() => []);
    const pairs: [string, string][] = [
      ["a", "alfa"],
      ["b", "beta"],
      ["a", "alpaka"],
    ];
    for (let pair of pairs) {
      const [k, v] = pair;
      dd.get(k).push(v);
    }

    const spread = [...dd];

    expect(spread).toEqual([
      ["a", ["alfa", "alpaka"]],
      ["b", ["beta"]],
    ]);
  });
});
