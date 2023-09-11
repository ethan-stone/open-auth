import { createHash } from "crypto";

export function hash(s: string) {
  return createHash("sha256").update(s).digest("base64");
}
