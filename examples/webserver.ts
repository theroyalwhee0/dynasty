import { createServer, IncomingMessage, ServerResponse, Server, RequestListener } from "node:http";
import Dynasty from "../src";

/**
 * Log function type.
 */
type Log = (...data: unknown[]) => void;

/**
 * Logger factory.
 */
function loggerFactory(method: keyof Console & ('log' | 'info' | 'warn' | 'error' | 'debug' | 'trace')): Log {
    return console[method].bind(console);
}

/**
 * Application factory.
 */
function appFactory(log: Log, httpServer: Server) {
    log("Application started.");
}

/**
 * Application Configuration.
 */
type AppConfig = {
    // HTTP Configuration.
    port: number;
    // Content Configuration.
    mimeType: string;
    content: string;
    // Logger Configuration.
    logMethod: keyof Console & ('log' | 'info' | 'warn' | 'error' | 'debug' | 'trace');
    // Application Configuration.
    exitAfter?: number; // Exit after N seconds. Not implemented.
};

/**
 * Default configuration.
 */
const appConfigDefault: AppConfig = {
    port: 80,
    mimeType: "text/plain",
    content: "Hello World.",
    logMethod: "info",
};

/**
 * Options for request handler.
 */
type RequestHandlerOptions = {
    log: Log;
    config: AppConfig;
    mimeType: string;
};

/**
 * Request handler.
 */
function requestHandlerFactory({ log, config, mimeType }: RequestHandlerOptions): RequestListener {
    const { content } = config;
    return (req: IncomingMessage, res: ServerResponse) => {
        const date = new Date().toISOString();
        const status = 200;
        res.writeHead(status, { "Content-Type": mimeType });
        res.end(content);
        log(`[${date}] ${status} ${req.method} ${req.url}`);
    }
}

/**
 * HttpServer factory.
 */
function httpServerFactory(log: Log, port: number, requestHandler: RequestListener): Promise<Server> {
    return new Promise<Server>((resolve) => {
        const server = createServer(requestHandler);
        server.listen(port, () => {
            log(`HTTP Server listening on http://localhost:${port}`);
            resolve(server);
        });
    });
}


/**
 * Main function.
 */
async function main() {
    console.info("[[[ Web Server ]]]");

    /**
     * Dynasty instance.
     */
    const dyn = new Dynasty();

    /**
     * Configuration.
     */
    const cfg = dyn.config<AppConfig>(appConfigDefault);
    cfg.update({ // Set port and logMethod by object.
        port: 8080,
        logMethod: 'info',
    });
    cfg.set("content", "Hello TypeScript!"); // Set content by key.

    cfg.lock();  // Lock the configuration. Any updates after this will throw.

    if (cfg.has("exitAfter")) { // Use has() to check if key exists on the configuration.
        throw new Error(`Feature 'exitAfter' is not implemented.`);
    }

    /**
     * Logger.
     */
    const log = dyn.once(loggerFactory, [
        cfg.select((cfg) => cfg.logMethod) // Get log method dependency with inline configuration get,
    ]);

    /**
     * Request handler.
     */
    const all = cfg.all(); // Get all of the configuration dependency.
    const mimeType = cfg.get("mimeType"); // Get mimeType dependency by key.
    const requestHandlerOptions = dyn.record<RequestHandlerOptions>({
        // Combine config dependencies with a record to build async options.
        log,
        config: all,
        mimeType
    });
    const requestHandler = dyn.many(requestHandlerFactory, [requestHandlerOptions]);

    /**
     * HttpServer.
     */
    const port = cfg.select((cfg) => cfg.port); // Get port dependency from separate configuration get.
    const httpServer = dyn.many(httpServerFactory, [log, port, requestHandler]);

    /**
     * Start application.
     */
    const app = dyn.many(appFactory, [log, httpServer]);
    await dyn.start(app);
}

main(); // Call main function.
