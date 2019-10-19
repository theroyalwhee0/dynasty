# Dynasty: @theroyalwhee0/dynasty

## Description
Dynasty is an asynchronous dependency injection library written in javascript.

## Installation
npm install @theroyalwhee0/dynasty

*or*

yarn add @theroyalwhee0/dynasty

## Requirements
This requires a modern browser supporting arrow functions, Symbols, Promises, and async function. To use with older browsers the code would need to be compiled and polyfilled.

## Documentation
There is little in the way of documentation at the moment.

See the example/ folder or review the Configuration Members reference below.

### Configurator Members

### Promise\<> **add**(String:name, Promise\<ParamFn>: ...paramFn);
Add a node. The first parameter is a unique name for the node. One of the remaining parameters must be a creator function (call, once, value, etc.). See other members for the remaining parameters. This function returns a promise, but does not need to be waited on.

```
add('name1', once(myFactory));
```

---

### Promise\<ParamFn> **args**(Any: ...args)
Add arguments to be passed to the creator function. If called multiple times arguments are concatinated.

```
add('name1', once(myFactory), args(1, 'A', { }));
```

---

### Promise\<ParamFn> **attach**(OneOf\<String|Object\<String:String>>: ...names)
Specifiy dependencies by name for a node. Attached node values will be supplied to the creator once the dependency tree is resolved.

```
add('name1', once(myFactory), attach('item1', { 'item2': 'alias1' }));
```

---

### Promise\<ParamFn> **call**(Function factory)

Calls a factory function to build the value for this node. The factory is supplied with the dependencies and arguments attached by other param functions.

```
function myFactory(dyn) {
    const { name2 } = dyn();
    typeof name2 === 'function' && name2();
    return Date.now();
}
add('name1', call(myFactory), depends('name2'));
```

---

### Promise\<ParamFn> **collect**()
Collects all of the nodes attached to the node into an object. That object is used as the nodes value.

```
add('name1', collect(), attach('item1', 'item2'));
```

---

### Promise\<ParamFn> **depends**(OneOf\<String|Object\<String:String>>: ...names)
Specify dependencies by name for a node. This creates a dependecy but does not supply the node value to the creators once the dependency tree is resolved.

```
add('name1', once(myFactory), depends('item1'));
```

---

### Promise\<ParamFn> **entryPoint**()
Specifiy the entry points that start the dependency tree. There may be multiple entry points.

```
add('name1', entryPoint(), depends('item1'));
```

---

### Promise\<ParamFn> **extend**(Object\<String:Any> props)
Makes the the values supplied directly available to the creator function. These values are not transformed or waited on.

```
add('name1', once(myFactory), extend({ config1: 'debug' }));
```

---

### Promise\<ParamFn> **once**(Function factory)

Calls a factory function to build the value for this node on first call, returning that value for all following calls. The factory is supplied with the dependencies and arguments attached by other param functions. This is a singleton version of call.

```
function myFactory(dyn) {
    const { name2 } = dyn();
    typeof name2 === 'function' && name2();
    return Date.now();
}
add('name1', once(myFactory), depends('name2'));
```

---

### Promise\<ParamFn> **pullMember**(String:name, String:member, PullMemberOptions:options={ bind=true })
Extracts a member of an object by name from an attached dependency. If the bind option is set to true and the value is a function it will bind the function to the parent object.


```
add('name1', pullMember('name1', 'doSomething'), attach('name1'));
add('name2', value({ doSomething: () => { console.log('Something...'); }}));
```

---

### Promise\<ParamFn> **value**(Any:value)
Uses the specified value as the value of the node. The value is resolved if it is a promise, but otherwise is unchanged.

```
add('name1', value(1234));
```

## Links
- GitHub: https://github.com/theroyalwhee0/dynasty
- NPM: https://www.npmjs.com/package/@theroyalwhee0/dynasty

## History
- 0.0.6 Move promise helpers to [@theroyalwhee0/please](https://github.com/theroyalwhee0/please)

## Legal & License
Copyright 2019 Adam Mill

Dynasty is released under Apache 2 license.  See LICENSE for more details.
