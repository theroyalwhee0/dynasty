import {getTypeOf} from '@theroyalwhee0/istype';

export type DynastyItemCreator = any;

export class DynastyItem {
    #creator?:DynastyItemCreator;
    #name:string = "";
    entryPoint = false;
    depends = new Set<string>();
    attach = new Set<string>();

    constructor(name:string) {
        this.#name = name;
    }

    get name():string {
        return this.#name;
    }

    set name(name:string) {
        this.#name = name;
    }

    get creator() {
        return this.#creator;
    }

    set creator(creator:any) {
        if(this.#creator !== undefined) {
            throw new Error(`"creator" already attached to node`);
        }
        this.#creator = creator;
    }

    serialize() : any {
        const obj: {
          name: string,
          creator?: string,
          entryPoint?: boolean,
          depends?: Array<string>,
          attach?: Array<string>,
        } = {
          name: this.#name,
        };
        if(this.#creator) {
            obj.creator = `${this.#creator.name} [${getTypeOf(this.#creator)}]`;
        }
        if(this.entryPoint) {
            obj.entryPoint = this.entryPoint;
        }
        if(this.depends && this.depends.size > 0) {
            obj.depends = [];
            this.depends.forEach((value) => {
                obj.depends.push(value);
            });
        }
        if(this.attach && this.attach.size > 0) {
            obj.attach = [];
            this.attach.forEach((value) => {
                obj.attach.push(value);
            });
        }
        return obj;
      }
}
