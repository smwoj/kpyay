import * as _ from "lodash";

/** Set using value equality for objects (instead of refs equality). */
export class BFSet<T> {
  //  * > things = new BFSet([{a: 1}, {a:1 }])
  //  * > [...things]
  //  * [{a: 1}]
  // TODO: turn into a civilized HashSet instead of BruteForceSet
  _items: T[];

  constructor(items?: T[]) {
    if (items) {
      this._items = _.uniqWith(items, _.isEqual);
    } else {
      this._items = [];
    }
  }

  add(t: T): void {
    if (!this._items.some((item) => _.isEqual(item, t))) {
      this._items.push(t);
    }
  }

  extend(ts: T[]): void {
    this._items = _.uniqWith([...this, ...ts], _.isEqual);
  }

  contains(t: T): boolean {
    return this._items.some((item) => _.isEqual(item, t));
  }

  remove(t: T): void {
    this._items = this._items.filter((item) => !_.isEqual(item, t));
  }

  clear(): void {
    this._items = [];
  }

  length(): number {
    return this._items.length;
  }

  *[Symbol.iterator]() {
    const view = this._items.slice();
    for (const item of view) {
      yield item;
    }
  }
}
