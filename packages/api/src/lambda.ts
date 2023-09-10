import { Hono } from "hono";
import { handle } from "hono/aws-lambda";

const app = new Hono();

app.get("/hello", (c) => {
  console.log("here");
  return c.text("Hello, world!");
});

export const handler = handle(app);
