# Dynasty: @theroyalwhee0/dynasty

## Description
Dynasty 2 is a typesafe asynchronous dependency injection framework for TypeScript.


## Installation
`npm install @theroyalwhee0/dynasty`


## Usage
```ts
import Dynasty from '@theroyalwhee0/dynasty';
(async function main() {
    const dyn = new Dynasty();
    const log = dyn.value((...args: unknown[]) => {
        console.log(...args);
    });
    type AppOptions = {
        state: string;
    }
    const options = dyn.record<AppOptions>({
        state: 'FL',
    });
    const table = dyn.once((log) => {
        const table = new Map<string, string>();
        table.set('AL', 'Alabama');
        table.set('CA', 'California');
        table.set('FL', 'Florida');
        table.set('GA', 'Georgia');
        table.set('TX', 'Texas');
        table.set('WA', 'Washington');
        log('TRACE | Table loaded.');
        return table;
    }, [log]);
    const app = dyn.once((log, table, options) => {
        const state = table.get(options.state) ?? 'Unknown';
        log(`INFO  | State: ${state}`);
    }, [log, table, options]);
    await dyn.start(app);
})();
```

See the [examples](./examples/Examples.md) for more usage demonstrations.


## Differences from Dynasty 1.x
Dynasty v2 is a complete rewrite of Dynasty 1.x. The librarie's approach to dependency injection is completly different. Dynasty v2 does not have a dependency graph. Instead, it helps the developer to manage their dependencies explicitly. Instead of using string-keyed dependencies, Dynasty v2 manages dependencies as normal typed TypeScript variables. Dynasty v2 is built as an ESModule library.


## Links
- GitHub: https://github.com/theroyalwhee0/dynasty
- NPM: https://www.npmjs.com/package/@theroyalwhee0/dynasty


## Legal & License
Copyright 2019-2024 Adam Mill

This library is released under Apache 2 license. See [LICENSE](https://github.com/theroyalwhee0/dynasty/blob/master/LICENSE) for more details.
