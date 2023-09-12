import { eq } from "drizzle-orm";
import { db as dbClient, PlanetScaleDatabase } from "src/db/client";
import * as schema from "src/db/schema";

type Client = typeof schema.clients.$inferSelect;
type NewClient = typeof schema.clients.$inferInsert;

export interface ClientRepo {
  create(client: NewClient): Promise<Client>;
  getById(id: string): Promise<Client | null>;
}

export class ClientsRepo implements ClientRepo {
  constructor(private db: PlanetScaleDatabase<typeof schema>) {}

  async create(client: NewClient): Promise<Client> {
    await this.db.insert(schema.clients).values(client);

    const result = (
      await this.db
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

  async getById(id: string): Promise<Client | null> {
    const result = (
      await this.db
        .select()
        .from(schema.clients)
        .where(eq(schema.clients.id, id))
    )[0];

    return result ?? null;
  }
}

export const clientsRepo = new ClientsRepo(dbClient);
