import { DynastyContext } from "./context";

export type DynastySettings = abstract new (...args: any) => any
export type DynastyConfiguratorCallback = (configurator:DynastyConfigurator) => DynastySettings;


export class DynastyConfigurator {
  context:DynastyContext;

  constructor(context:DynastyContext) {
    this.context = context;
    this.once = this.once.bind(this);
    this.name = this.name.bind(this);
    this.depends = this.depends.bind(this);
    this.attach = this.attach.bind(this);
    this.entryPoint = this.entryPoint.bind(this);
  }

  entryPoint(_target: () => any, context: ClassMethodDecoratorContext) {
    const item = this.context.item(context.name)
    item.creator = ():undefined => undefined;
    item.entryPoint = true;
  }

  once(_target: () => any, context: ClassMethodDecoratorContext) {
    const item = this.context.item(context.name)
  }

  name(name:string) {
    return (_target: () => any, context: ClassMethodDecoratorContext) : void => {
      const item = this.context.item(context.name)
      item.name = name;
    }  
  }

  depends(...keys:string[]) {
    return (_target: () => any, context: ClassMethodDecoratorContext) : void => {
      const item = this.context.item(context.name)
      for(let key of keys) {
        item.depends.add(key);
      }
    }  
  }

  attach(...keys:string[]) {
    return (_target: () => any, context: ClassMethodDecoratorContext) : void => {
      const item = this.context.item(context.name)
      for(let key of keys) {
        item.attach.add(key);
      }
    }  
  } 
}