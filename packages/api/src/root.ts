import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { logger } from "src/middleware/logger";

const app = new Hono();

app.use("*", logger());

app.get("/hello", (c) => {
  return c.text("Hello, world!");
});

export const handler = handle(app);
