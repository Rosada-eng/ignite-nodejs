import { FastifyInstance } from 'fastify'
import { register } from './register'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { remove } from './delete'

export async function authenticatedPetRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT)

    app.post('/adoption', register)
    app.delete('/adoption', remove)
}

export async function petRoutes(app: FastifyInstance) {
    app.register(authenticatedPetRoutes, {
        prefix: '/pet',
    })
}
