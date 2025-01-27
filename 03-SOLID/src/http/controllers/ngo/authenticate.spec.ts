import { app } from '@/app'
import supertest from 'supertest'
import { expect, it, describe, afterAll, beforeAll } from 'vitest'

describe('Authenticate NGO (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to authenticate ngo', async () => {
        const inputData = {
            name: 'NGO Test',
            email: 'ngotest@example.com',
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
            .send(inputData)

        expect(createNgoResponse.statusCode).toEqual(201)

        const response = await supertest(app.server)
            .post('/ngo/authenticate')
            .send(inputData)

        expect(response.statusCode).toEqual(200)
        expect(response.body).toMatchObject({
            token: expect.any(String),
        })
    })
})
