import { app } from '@/app'
import supertest from 'supertest'
import { expect, it, describe, afterAll, beforeAll } from 'vitest'
import { createAndAuthenticateNgo } from '@/utils/tests/create-and-authenticate-ngo'

describe('Create Pet (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to create a pet', async () => {
        const { token, ngo } = await createAndAuthenticateNgo(app)

        const response = await supertest(app.server)
            .post('/pet/adoption')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Rex',
                birthdate: new Date(),
                size: 2,
                energyLevel: 4,
                independenceLevel: 3,
                spaceForLiving: 2,
                requirements: ['Needs daily walks', 'Good with kids'],
                ngoId: ngo.id,
            })

        expect(response.statusCode).toEqual(201)
        expect(response.body.pet).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                name: 'Rex',
            })
        )
    })
})
