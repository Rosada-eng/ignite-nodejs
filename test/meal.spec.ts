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

async function createUserAndLogin() {
  // Register a user
  await supertest(app.server)
    .post("/user/register")
    .send({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456",
    })

  // Login to get the cookie
  const loginResponse = await supertest(app.server)
    .post("/user/login")
    .send({
      email: "john.doe@example.com",
      password: "123456",
    })

  return loginResponse.headers['set-cookie']
}

test("should create a new meal", async () => {
  const cookies = await createUserAndLogin()

  const response = await supertest(app.server)
    .post("/meals/register")
    .set('Cookie', cookies)
    .send({
      name: "Salad",
      description: "Fresh vegetables",
      in_diet: true,
      consumed_at: "2024-03-20T12:00:00Z",
    })

  expect(response.statusCode).toEqual(201)
})

test("should list user meals", async () => {
  const cookies = await createUserAndLogin()

  // Create a meal first
  await supertest(app.server)
    .post("/meals/register")
    .set('Cookie', cookies)
    .send({
      name: "Salad",
      in_diet: true,
    })

  const response = await supertest(app.server)
    .get("/meals/me")
    .set('Cookie', cookies)

  expect(response.statusCode).toEqual(200)
  expect(response.body.meals).toHaveLength(1)
  expect(response.body.meals[0].name).toEqual("Salad")
})

test("should get meal by id", async () => {
  const cookies = await createUserAndLogin()

  // Create a meal first
  await supertest(app.server)
    .post("/meals/register")
    .set('Cookie', cookies)
    .send({
      name: "Burger",
      in_diet: false,
    })

  const listResponse = await supertest(app.server)
    .get("/meals/me")
    .set('Cookie', cookies)

  const mealId = listResponse.body.meals[0].id

  const response = await supertest(app.server)
    .get(`/meals/${mealId}`)
    .set('Cookie', cookies)

  expect(response.statusCode).toEqual(200)
  expect(response.body.meal.name).toEqual("Burger")
})

test("should update a meal", async () => {
  const cookies = await createUserAndLogin()

  // Create a meal first
  await supertest(app.server)
    .post("/meals/register")
    .set('Cookie', cookies)
    .send({
      name: "Pizza",
      in_diet: false,
    })

  const listResponse = await supertest(app.server)
    .get("/meals/me")
    .set('Cookie', cookies)

  const mealId = listResponse.body.meals[0].id

  const response = await supertest(app.server)
    .patch(`/meals/${mealId}`)
    .set('Cookie', cookies)
    .send({
      name: "Healthy Pizza",
      in_diet: true,
    })

  expect(response.statusCode).toEqual(204)
})

test("should delete a meal", async () => {
  const cookies = await createUserAndLogin()

  // Create a meal first
  await supertest(app.server)
    .post("/meals/register")
    .set('Cookie', cookies)
    .send({
      name: "Ice Cream",
      in_diet: false,
    })

  const listResponse = await supertest(app.server)
    .get("/meals/me")
    .set('Cookie', cookies)

  const mealId = listResponse.body.meals[0].id

  const response = await supertest(app.server)
    .delete(`/meals/${mealId}`)
    .set('Cookie', cookies)

  expect(response.statusCode).toEqual(204)
})

test("should get user metrics", async () => {
  const cookies = await createUserAndLogin()

  // Create multiple meals to test metrics
  await supertest(app.server)
    .post("/meals/register")
    .set('Cookie', cookies)
    .send({
      name: "Salad",
      in_diet: true,
    })

  await supertest(app.server)
    .post("/meals/register")
    .set('Cookie', cookies)
    .send({
      name: "Pizza",
      in_diet: false,
    })

  await supertest(app.server)
    .post("/meals/register")
    .set('Cookie', cookies)
    .send({
      name: "Grilled Chicken",
      in_diet: true,
    })

  const response = await supertest(app.server)
    .get("/meals/metrics")
    .set('Cookie', cookies)

  expect(response.statusCode).toEqual(200)
  expect(response.body.metrics).toEqual({
    totalMeals: 3,
    mealsWithinDiet: 2,
    mealsOutsideDiet: 1,
    bestDietStreak: 1,
  })
})
