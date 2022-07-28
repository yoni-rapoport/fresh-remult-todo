import { remultFresh } from "remult/remult-fresh";
import { Task } from "../model/task.ts";
import { createPostgresConnection } from "https://deno.land/x/remult/postgres.ts";

export const remultServer = remultFresh({
  entities: [Task],
  dataProvider: async () => {
    const dbUrl = Deno.env.get("DATABASE_URL");
    if (dbUrl) {
      return createPostgresConnection({ connectionString: dbUrl });
    }
    return await undefined;
  },
}, Response);

export const handler = remultServer.handle;