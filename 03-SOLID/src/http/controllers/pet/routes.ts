import { FastifyInstance } from 'fastify'
import { register } from './register'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function authenticatedPetRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT)

    app.post('/adoption', register)
}

export async function petRoutes(app: FastifyInstance) {
    app.register(authenticatedPetRoutes, {
        prefix: '/pet',
    })
}
