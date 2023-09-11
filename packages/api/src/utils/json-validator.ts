import { validator } from "hono/validator";
import { ZodSchema } from "zod";

export function jsonValidator(schema: ZodSchema) {
  return validator("json", (value, c) => {
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
  });
}
