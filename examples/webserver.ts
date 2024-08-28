import { createServer, IncomingMessage, ServerResponse, Server, RequestListener } from "node:http";
import Dynasty from "../src";

/**
 * Log function type.
 */
type Log = (...data: unknown[]) => void;

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
    method: keyof Console & ('log' | 'info' | 'warn' | 'error' | 'debug' | 'trace');
    // Application Configuration.
    exitAfter: number; // Exit after N seconds.
};

/**
 * Request handler.
 */
function requestHandlerFactory(log: Log): RequestListener {
    return (req: IncomingMessage, res: ServerResponse) => {
        const date = new Date().toISOString();
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Hello World!");
        log(`[${date}] ${req.method} ${req.url}`);
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
     * Logger.
     */
    const log = dyn.value(console.log);

    /**
     * Request handler.
     */
    const requestHandler = dyn.many(requestHandlerFactory, [log]);

    /**
     * HttpServer.
     */
    const httpServer = dyn.many(httpServerFactory, [log, dyn.value(8080), requestHandler]);

    /**
     * Start application.
     */
    const app = dyn.many(appFactory, [log, httpServer]);
    await dyn.start(app);
}

main(); // Call main function.
