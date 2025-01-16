import fastify from "fastify"
import cookie, { FastifyCookieOptions } from "@fastify/cookie"
import { userRoutes } from "./routes/user.routes"
import { mealRoutes } from "./routes/meal.routes"
import { isValidUser } from "./middlewares/is-valid-user"
import { env } from "./config/env"

export const app = fastify()

app.register(
  cookie,
  {
    secret: env.SECRET_KEY,
    hook: "onRequest",
    parseOptions: {},
  } as FastifyCookieOptions,
)

app.setErrorHandler(async (error, request, reply) => {
    console.error(error)
    
    reply
      .status(500)
      .send({
        error: 'Internal Server Error',
        message: error.message,
        statusCode: 500,
      })
  })

app.register(userRoutes, {prefix: "/user"});

app.register(
  mealRoutes, 
  {
    preHandler: [isValidUser],
    prefix: "/meals",
  },
);