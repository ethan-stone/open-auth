import { MiddlewareHandler, HonoRequest } from "hono";
import { log } from "src/utils/logger";

export const getPath = (request: HonoRequest): string => {
  // Optimized: RegExp is faster than indexOf() + slice()
  const match = request.url.match(/^https?:\/\/[^/]+(\/[^?]*)/);
  return match ? match[1] : "";
};

export function logger(): MiddlewareHandler {
  return async (c, next) => {
    const start = Date.now();

    const path = getPath(c.req);

    log.info("Incoming request", {
      method: c.req.method,
      path,
    });

    console.log("owiejfoweijf");

    await next();

    log.info("Outgoing response", {
      method: c.req.method,
      path,
      statusCode: c.res.status,
      duration: Date.now() - start,
    });
  };
}
