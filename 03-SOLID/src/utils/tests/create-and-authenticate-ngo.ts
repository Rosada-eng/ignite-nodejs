import { Ngo } from '@prisma/client'
import { FastifyInstance } from 'fastify'
import supertest from 'supertest'

export async function createAndAuthenticateNgo(
    app: FastifyInstance,
    email = 'ngotest@example.com'
) {
    const ngoInputData = {
        name: 'NGO Test',
        email,
        password: '12345678',
        address: '123 Main St',
        zipcode: '12345-678',
        city: 'City Test',
        state: 'State Test',
        phone: '1234567890',
        latitude: 123,
        longitude: 456,
    }

    const createNgoResponse = await supertest(app.server)
        .post('/ngo/register')
        .send(ngoInputData)

    const ngo: Ngo = createNgoResponse.body.ngo

    const authResponse = await supertest(app.server)
        .post('/ngo/authenticate')
        .send({
            email: ngoInputData.email,
            password: ngoInputData.password,
        })

    const { token } = authResponse.body

    return {
        ngo,
        token,
    }
}
