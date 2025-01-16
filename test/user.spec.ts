import { afterAll, beforeAll, beforeEach, expect, test } from "vitest"
import supertest from "supertest"
import { app } from "../src/app"
import { execSync } from "node:child_process"

beforeAll(async () => {
  await app.ready()
})

beforeEach(() => {
  execSync("npm run knex migrate:rollback --all")
  execSync("npm run knex migrate:latest")
})

afterAll(async () => {
  await app.close()
})

test("create a new user", async () => {
  const response = await supertest(app.server)
    .post("/user/register")
    .send({
        name: "John Doe",
        email: "john.doe@example.com",
        password: "123456",
    })

  expect(response.statusCode).toEqual(201)
})

test("should be able to login existing user", async () => {

  await supertest(app.server)
    .post("/user/register")
    .send({
      name: "John Doe Test",
      email: "john.doe@example.com",
      password: "1234567890",
    })

  const response = await supertest(app.server)
    .post("/user/login")
    .send({
      email: "john.doe@example.com",
      password: "1234567890",
    })

  expect(response.statusCode).toEqual(200)
  expect(response.headers['set-cookie'][0]).toContain('userId')
})
