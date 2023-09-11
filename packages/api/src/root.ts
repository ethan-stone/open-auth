import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { validator } from "hono/validator";
import { logger } from "src/middleware/logger";
import { z } from "zod";
import { createClient } from "./use-cases/create-client";
import { clientsRepo } from "./repos/clients-repo";
import { json } from "stream/consumers";
import { jsonValidator } from "./utils/json-validator";

const app = new Hono();

app.use("*", logger());

const schema = z.object({
  name: z.string(),
});

type Schema = z.infer<typeof schema>;

app.post("/clients", jsonValidator(schema), async (c) => {
  const json = c.req.valid("json") as Schema;

  const client = await createClient(
    {
      name: json.name,
    },
    {
      clientRepo: clientsRepo,
    }
  );

  return c.json(client);
});

export const handler = handle(app);
