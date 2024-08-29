import Dynasty from '../src';
// This is the compact example used in the README.md file.
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