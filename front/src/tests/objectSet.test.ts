import { BFSet } from "../lib/collections";

describe("BFSet", () => {
  it("dedups & spreads like mayo", () => {
    const set = new BFSet<number>([1, 2, 1]);
    const items = [...set].sort();

    expect(items).toEqual([1, 2]);
  });

  it("adds numbers", () => {
    const set = new BFSet<number>();
    let actual;

    set.add(12);
    expect([...set]).toEqual([12]);

    set.add(5);
    actual = [...set].sort((x, y) => x - y);
    expect(actual).toEqual([5, 12]);
  });

  it("removes strings", () => {
    const set = new BFSet<string>(["alf", "bob", "alf"]);

    expect([...set].sort()).toEqual(["alf", "bob"]);

    set.remove("alf");
    expect([...set].sort()).toEqual(["bob"]);

    set.remove("bob");
    set.remove("clair");
    set.remove("donna");
    set.remove("emily");
    expect([...set]).toEqual([]);
  });

  it("can be cleared", () => {
    const pieces = ["o fortuna", "rondo alla turca"];
    const set = new BFSet<string>(pieces);

    expect([...set].sort()).toEqual(pieces);

    set.clear();
    expect([...set].sort()).toEqual([]);
  });
});

describe("BFSet supports objects with value semantics", () => {
  it(".contains works", () => {
    const set = new BFSet<any>([{ a: 1 }, { b: 2 }, { a: 1 }]);

    expect(set.contains({ a: 1 })).toBeTruthy();
    expect(set.contains({ b: 2 })).toBeTruthy();
    expect(set.contains({ x: 42 })).toBeFalsy();
  });

  it(".extend works", () => {
    const set = new BFSet<any>([{ a: 1 }, { a: 1 }]);
    expect([...set].sort()).toEqual([{ a: 1 }]);

    set.extend([{ c: 4 }, { d: 10 }]);
    expect(set.contains({ a: 1 })).toBeTruthy();
  });
});
