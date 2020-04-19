import * as _ from "lodash";

export class DefaultDict<T> {
  data: { [keys: string]: T };
  init: () => T;

  constructor(defaultInit: () => T, data?: { [keys: string]: T }) {
    this.init = defaultInit;
    this.data = data ? data : {};
  }

  get(key: string): T {
    if (!(key in this.data)) {
      this.data[key] = this.init();
    }
    return this.data[key];
  }

  *[Symbol.iterator]() {
    const view = _.entries(this.data);
    for (let item of view) {
      yield item;
    }
  }

  clone(): DefaultDict<T> {
    return new DefaultDict<T>(this.init, { ...this.data });
  }
}

/** Set using value equality for objects (instead of refs equality).
 * > things = new ObjectSet([{a: 1}, {a:1 }])
 * > [...things]
 * [{a: 1}]
 * */
export class BFSet<T> {
  // BruteForceSet; TODO: turn into a civilized HashSet
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
    for (let item of view) {
      yield item;
    }
  }
}
