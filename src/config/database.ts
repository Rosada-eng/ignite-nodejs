import { knex as setupKnex, Knex } from "knex"

export const config: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: "./database/app.db",
  },
  useNullAsDefault: true,
  migrations: {
    directory: "./database/migrations",
    extension: "ts",
  },
}

export const knex = setupKnex(config)
