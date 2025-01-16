import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { knex } from "src/config/database"
import { z } from "zod"
import { hash, compare } from "bcryptjs"
import { randomUUID } from "node:crypto"

export async function userRoutes(app: FastifyInstance) {
  app.post(
    "/register",
    async (request: FastifyRequest, reply: FastifyReply) => {
    
      const registerUseSchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
      })

      const { name, email, password } = registerUseSchema.parse(request.body)

      const hashedPassword = await hash(password, 6)

      await knex("users").insert({
        id: randomUUID(),
        name,
        email,
        password_hash: hashedPassword,
      })

      return reply.status(201).send()
    },
  )

  app.post(
    "/login",
    async (request: FastifyRequest, reply: FastifyReply) => {

        const loginUserSchema = z.object({
            email: z.string().email(),
            password: z.string().min(6),
        })

        const { email, password } = loginUserSchema.parse(request.body)
        
        const user = await knex("users").where({
          email,
        }).first()
        
        if (!user) {
          return reply.status(401).send({ message: "Invalid credentials" })
        }
        
        const passwordMatch = await compare(password, user.password_hash)

        if (!passwordMatch) {
          return reply.status(401).send({ message: "Invalid credentials" })
        }

        reply.setCookie("userId", user.id, {
          path: "/",
          maxAge: 1000 * 60 * 60 * 1, // 1 hour
          signed: true,
        })

        return reply.status(200).send()

    },
  )
}
