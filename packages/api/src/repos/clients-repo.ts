import { eq } from "drizzle-orm";
import { db, PlanetScaleDatabase } from "src/db/client";
import * as schema from "src/db/schema";

type Client = typeof schema.clients.$inferSelect;
// type SafeClient = Omit<Client, "secret">;
type NewClient = typeof schema.clients.$inferInsert;

export interface ClientRepo {
  create(client: NewClient): Promise<Client>;
}

export class ClientsRepo implements ClientRepo {
  constructor(private db: PlanetScaleDatabase<typeof schema>) {}

  async create(client: NewClient): Promise<Client> {
    await db.insert(schema.clients).values(client);

    const result = (
      await db
        .select()
        .from(schema.clients)
        .where(eq(schema.clients.id, client.id))
    )[0];

    if (!result) {
      throw new Error(
        `Could not find client with id ${client.id} after inserting. Extremely weird if this happens`
      );
    }

    return result;
  }
}

export const clientsRepo = new ClientsRepo(db);
