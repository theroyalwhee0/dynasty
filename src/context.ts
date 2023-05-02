import { DynastyItem } from "./item";

export class DynastyContext {
  items = new Map<string, DynastyItem>();

  item(name: string | Symbol): DynastyItem {
    if (typeof name === "string") {
      if (this.items.has(name)) {
        return this.items.get(name);
      } else {
        const item = new DynastyItem(name);
        this.items.set(name, item);
        return item;
      }
    } else {
      throw new Error(`Dynasty does not support items with symbolic keys "${name}".`);
    }
  }

  getEntryPoints(): DynastyItem[] {
    const entryPoints: DynastyItem[] = [];
    for (const item of this.items.values()) {
      if (item.entryPoint) {
        entryPoints.push(item)
      }
    }
    return entryPoints;
  }

  serialize(): any {
    const obj: {
      items: Record<string, any>;
    } = {
      items: {},
    };
    this.items.forEach((item: DynastyItem, key: string) => {
      obj.items[key] = item.serialize();
    });
    return obj;
  }

  toString(space?: string | number): string {
    const serialized = this.serialize();
    return JSON.stringify(serialized, null, space);
  }
}
