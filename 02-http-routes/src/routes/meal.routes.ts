import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { randomUUID } from "node:crypto"
import { knex } from "src/config/database"
import { z } from "zod"

export async function mealRoutes(app: FastifyInstance) {
  app.get(
    "/me",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.cookies.userId

      const meals = await knex("meals").where("user_id", userId)

      return reply.status(200).send({ meals })
  })

  app.get(
    "/:id", 
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.cookies.userId

      const retrieveMealParameterSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = retrieveMealParameterSchema.parse(request.params)
      
      const meal = await knex("meals").where("id", id).first()

      if (!meal) {
        return reply.status(404).send({ message: "Meal not found" })
      }

      if (meal.user_id !== userId) {
        return reply.status(403).send({ message: "You are not allowed to view this meal" })
      }

      return reply.status(200).send({ meal })
  })

  app.post(
    "/register",
    async (request: FastifyRequest, reply: FastifyReply) => {

      const registerMealBodySchema = z.object({
        name: z.string(),
        description: z.string().optional(),
        in_diet: z.boolean(),
        consumed_at: z.string().datetime().optional().default(new Date().toISOString()),
      })

      const { 
        name, 
        description, 
        in_diet, 
        consumed_at,
      } = registerMealBodySchema.parse(request.body)

      const userId = request.cookies.userId

      await knex("meals").insert({
        id: randomUUID(),
        name,
        description,
        in_diet,
        consumed_at,
        user_id: userId,
      })

      return reply.status(201).send(`"${name}" consumed at ${consumed_at}`)
    },
  )

  app.patch("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.cookies.userId

    const updateMealBodySchema = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      in_diet: z.boolean().optional(),
      consumed_at: z.string().datetime().optional(),
    })

    const retrieveMealParameterSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = retrieveMealParameterSchema.parse(request.params)

    const updateMealData = updateMealBodySchema.parse(request.body)

    const meal = await knex("meals").where("id", id).first()

    if (!meal) {
      return reply.status(404).send({ message: "Meal not found" })
    }

    if (meal.user_id !== userId) {
      return reply.status(403).send({ message: "You are not allowed to update this meal" })
    }

    await knex("meals").where("id", id).update(updateMealData)

    return reply.status(204).send()
  })

  app.delete("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.cookies.userId

    const retrieveMealParameterSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = retrieveMealParameterSchema.parse(request.params)

    const meal = await knex("meals").where("id", id).first()

    if (!meal) {
      return reply.status(404).send({ message: "Meal not found" })
    }

    if (meal.user_id !== userId) {
      return reply.status(403).send({ message: "You are not allowed to delete this meal" })
    }

    await knex("meals").where("id", id).delete()

    return reply.status(204).send()
  })

  app.get(
    "/metrics", 
    async (request: FastifyRequest, reply: FastifyReply) => {
   
      const userId = request.cookies.userId

      const [metrics] = await knex.raw(`
        WITH RECURSIVE
        numbered_meals AS (
          SELECT 
            in_diet,
            consumed_at,
            ROW_NUMBER() OVER (ORDER BY consumed_at) as rn
          FROM meals
          WHERE user_id = ?
        ),
        streaks AS (
          SELECT 
            in_diet,
            consumed_at,
            rn,
            CASE 
              WHEN in_diet = 1 THEN 1
              ELSE 0
            END as current_streak,
            CASE 
              WHEN in_diet = 0 THEN rn
              ELSE 0
            END as streak_breaker
          FROM numbered_meals
          WHERE rn = 1
          
          UNION ALL
          
          SELECT 
            m.in_diet,
            m.consumed_at,
            m.rn,
            CASE 
              WHEN m.in_diet = 1 THEN 
                CASE 
                  WHEN s.in_diet = 1 THEN s.current_streak + 1
                  ELSE 1
                END
              ELSE 0
            END as current_streak,
            CASE 
              WHEN m.in_diet = 0 THEN m.rn
              ELSE s.streak_breaker
            END as streak_breaker
          FROM numbered_meals m
          JOIN streaks s ON m.rn = s.rn + 1
        )
        SELECT 
          COUNT(*) as total_meals,
          SUM(CASE WHEN in_diet = 1 THEN 1 ELSE 0 END) as meals_within_diet,
          SUM(CASE WHEN in_diet = 0 THEN 1 ELSE 0 END) as meals_outside_diet,
          MAX(current_streak) as best_diet_streak
        FROM streaks
      `, [userId])

      return reply.status(200).send({
        metrics: {
          totalMeals: Number(metrics.total_meals),
          mealsWithinDiet: Number(metrics.meals_within_diet),
          mealsOutsideDiet: Number(metrics.meals_outside_diet),
          bestDietStreak: Number(metrics.best_diet_streak),
        },
      })
  })
}
