import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (t) => {
    t.uuid("id").primary()
    t.string("email").notNullable().unique()
    t.string("hash").notNullable()
    t.string("name").notNullable()
    t.dateTime("created_at").notNullable().defaultTo(knex.fn.now())
  })

  await knex.schema.createTable("meals", (t) => {
    t.uuid("id").primary()
    t.uuid("user_id").references("id").inTable("users").notNullable()
    t.string("name").notNullable()
    t.string("description").notNullable()
    t.boolean("in_diet").notNullable().defaultTo(false)
    t.dateTime("consumed_at").notNullable().defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTable("users")
}
