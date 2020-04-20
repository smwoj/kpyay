import * as _ from "lodash";

/** Dictionary inserting value for missing keys with provided initializer. */
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
    for (const item of view) {
      yield item;
    }
  }
}
