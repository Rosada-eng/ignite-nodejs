import { app } from '@/app'
import supertest from 'supertest'
import { expect, it, describe, afterAll, beforeAll } from 'vitest'
import { createAndAuthenticateNgo } from '@/utils/tests/create-and-authenticate-ngo'

describe('Update Pet (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to update a pet', async () => {
        const { token, ngo } = await createAndAuthenticateNgo(app)

        const createPetResponse = await supertest(app.server)
            .post('/pet/adoption')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Rex',
                birthdate: new Date(),
                size: 2,
                energyLevel: 4,
                independenceLevel: 3,
                spaceForLiving: 2,
                requirements: ['Needs daily walks'],
                ngoId: ngo.id,
            })

        const { id } = createPetResponse.body.pet

        const response = await supertest(app.server)
            .put('/pet/adoption')
            .set('Authorization', `Bearer ${token}`)
            .send({
                petId: id,
                name: 'Updated Rex',
                energyLevel: 5,
                requirements: ['Needs daily walks', 'New requirement'],
            })

        expect(response.statusCode).toEqual(200)
        expect(response.body.pet).toEqual(
            expect.objectContaining({
                name: 'Updated Rex',
                energyLevel: 5,
            })
        )
    })
})
