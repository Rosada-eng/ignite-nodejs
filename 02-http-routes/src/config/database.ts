import { knex as setupKnex, Knex } from "knex"
import { env } from "./env"

export const config: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    directory: "./database/migrations",
    extension: "ts",
  },
  debug: env.NODE_ENV === "development",
}

export const knex = setupKnex(config)