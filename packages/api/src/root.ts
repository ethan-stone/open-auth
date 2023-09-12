import { Context, Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { logger } from "src/middleware/logger";
import { z } from "zod";
import { createClient } from "./use-cases/create-client";
import { clientsRepo } from "./repos/clients-repo";
import { jsonValidator } from "./utils/json-validator";
import { BaseError } from "./errors";
import { createToken } from "./use-cases/create-token";
import { log } from "./utils/logger";

async function runUseCase(
  c: Context,
  cb: () => Promise<Record<string, unknown> | void>
) {
  try {
    const result = await cb();

    if (typeof result === "object") return c.json(result, { status: 200 });

    return c.json(null, { status: 204 });
  } catch (error) {
    log.error("error", error);
    if (error instanceof BaseError) {
      return c.json(
        { error: { name: error.name, message: error.message } },
        { status: error.code }
      );
    } else {
      return c.json({
        error: {
          name: "InternalServerError",
          message: "An internal error occurred.",
        },
      });
    }
  }
}

const app = new Hono();

app.use("*", logger());

const createClientSchema = z.object({
  name: z.string(),
});

app.post("/clients", jsonValidator(createClientSchema), async (c) => {
  const json = c.req.valid("json") as z.infer<typeof createClientSchema>;

  return await runUseCase(c, async () =>
    createClient(json, { clientRepo: clientsRepo })
  );
});

const oauth = new Hono();

const createTokenSchema = z.object({
  clientId: z.string(),
  clientSecret: z.string(),
  grantType: z.enum(["client_credentials"]),
});

oauth.post("/tokens", jsonValidator(createTokenSchema), async (c) => {
  const json = c.req.valid("json") as z.infer<typeof createTokenSchema>;

  return await runUseCase(c, async () =>
    createToken(json, { clientRepo: clientsRepo })
  );
});

app.route("/oauth", oauth);

export const handler = handle(app);
