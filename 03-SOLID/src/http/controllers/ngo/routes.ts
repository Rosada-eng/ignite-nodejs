import { FastifyInstance } from 'fastify'
import { register } from './register'
import { authenticate } from './authenticate'

export async function ngoRoutes(app: FastifyInstance) {
    app.post('/ngo/register', register)
    app.post('/ngo/authenticate', authenticate)
}
