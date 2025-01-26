import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import { ngoRoutes } from './http/controllers/ngo/routes'
import { petRoutes } from './http/controllers/pet/routes'

export const app = fastify()

app.register(fastifyJwt, {
    secret: 'my-jwt-secret',
    sign: {
        expiresIn: '30m',
    },
})

app.register(fastifyCors, {
    origin: true,
})

app.register(ngoRoutes)
app.register(petRoutes)
