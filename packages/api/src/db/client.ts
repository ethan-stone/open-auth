import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import { Config } from "sst/node/config";
import * as schema from "./schema";
export { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless";

// create the connection
const connection = connect({
  host: Config.DATABASE_HOST,
  username: Config.DATABASE_USERNAME,
  password: Config.DATABASE_PASSWORD,
});

export const db = drizzle(connection, { schema });
