import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { validator } from "hono/validator";
import { logger } from "src/middleware/logger";
import { z } from "zod";
import { db } from "./db/client";
import { clients } from "./db/schema";
import { uid } from "./utils/uid";
import { eq } from "drizzle-orm";

const app = new Hono();

app.use("*", logger());

const schema = z.object({
  name: z.string(),
});

type Schema = z.infer<typeof schema>;

app.post(
  "/clients",
  validator("json", (value, c) => {
    const parsed = schema.safeParse(value);

    if (!parsed.success) {
      return c.json(
        {
          error: "Invalid request",
        },
        400
      );
    }

    return parsed.data;
  }),
  async (c) => {
    const json = c.req.valid("json") as Schema;

    const id = uid(36);

    await db.insert(clients).values({
      id,
      name: json.name,
    });

    const result = await db.query.clients.findFirst({
      where: eq(clients.id, id),
    });

    return c.json(result);
  }
);

export const handler = handle(app);
