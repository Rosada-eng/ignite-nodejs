import { expect, it, describe, beforeAll, afterAll } from 'vitest'
import { app } from '@/app'
import supertest from 'supertest'

describe('Register NGO (e2e)', () => {
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

    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to register ngo', async () => {
        const response = await supertest(app.server)
            .post('/ngo/register')
            .send(inputData)

        expect(response.statusCode).toEqual(201)
        expect(response.body).toMatchObject({
            ngo: {
                id: expect.any(String),
            },
        })
    })

    it('should not be able to register ngo with the same email', async () => {
        const response = await supertest(app.server)
            .post('/ngo/register')
            .send(inputData)

        expect(response.statusCode).toEqual(500)
    })
})
