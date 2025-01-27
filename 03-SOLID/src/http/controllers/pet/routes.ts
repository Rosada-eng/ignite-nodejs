import { FastifyInstance } from 'fastify'
import { register } from './register'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { remove } from './delete'
import { update } from './update'
import { adopt } from './adopt'
import { listAvailablePets } from './list-available'

export async function protectedPetRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT)

    app.post('/adoption', register)
    app.delete('/adoption', remove)
    app.put('/adoption', update)
    app.put('/adoption/adopt', adopt)
}

export async function petRoutes(app: FastifyInstance) {
    app.register(protectedPetRoutes, {
        prefix: '/pet',
    })

    app.get('/pets', listAvailablePets)
}
