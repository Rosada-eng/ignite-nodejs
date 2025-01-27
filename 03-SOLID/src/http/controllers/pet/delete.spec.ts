import supertest from 'supertest'
import { app } from '@/app'
import { expect, it, describe, afterAll, beforeAll } from 'vitest'
import { createAndAuthenticateNgo } from '@/utils/tests/create-and-authenticate-ngo'
describe('Delete Pet (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to delete a pet', async () => {
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
            .delete('/pet/adoption')
            .set('Authorization', `Bearer ${token}`)
            .send({
                petId: id,
            })

        expect(response.statusCode).toEqual(204)
    })
})
