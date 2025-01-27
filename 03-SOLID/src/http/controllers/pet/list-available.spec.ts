import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateNgo } from '@/utils/tests/create-and-authenticate-ngo'
import { Ngo } from '@prisma/client'
import request from 'supertest'
import {
    afterAll,
    afterEach,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
} from 'vitest'

describe('List Available Pets (e2e)', () => {
    let aNgoToken: string
    let aNgo: Ngo

    beforeAll(async () => {
        await app.ready()
    })

    beforeEach(async () => {
        const { token, ngo } = await createAndAuthenticateNgo(app)
        aNgoToken = token
        aNgo = ngo
    })

    afterEach(async () => {
        await prisma.pet.deleteMany()
        await prisma.ngo.deleteMany()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to list available pets by city', async () => {
        await request(app.server)
            .post('/pet/adoption')
            .set('Authorization', `Bearer ${aNgoToken}`)
            .send({
                name: 'Pet 01',
                birthdate: '2023-01-01',
                size: 2,
                energyLevel: 4,
                independenceLevel: 3,
                spaceForLiving: 3,
                requirements: ['Friendly with kids'],
                ngoId: aNgo.id,
            })

        await request(app.server)
            .post('/pet/adoption')
            .set('Authorization', `Bearer ${aNgoToken}`)
            .send({
                name: 'Pet 02',
                birthdate: '2023-01-01',
                size: 2,
                energyLevel: 4,
                independenceLevel: 3,
                spaceForLiving: 3,
                requirements: ['Friendly with kids'],
                ngoId: aNgo.id,
            })

        const response = await request(app.server)
            .get('/pets')
            .query({
                city: aNgo.city,
            })
            .send()

        expect(response.statusCode).toEqual(200)
        expect(response.body.pets).toHaveLength(2)
        expect(response.body.pets).toEqual([
            expect.objectContaining({
                name: 'Pet 01',
            }),
            expect.objectContaining({
                name: 'Pet 02',
            }),
        ])
    })

    it('should be able to filter pets by age category', async () => {
        const babyPetResponse = await request(app.server)
            .post('/pet/adoption')
            .set('Authorization', `Bearer ${aNgoToken}`)
            .send({
                name: 'Baby Pet',
                birthdate: new Date().toISOString().split('T')[0], // Current date formatted as YYYY-MM-DD
                size: 2,
                energyLevel: 4,
                independenceLevel: 3,
                spaceForLiving: 3,
                requirements: ['Friendly with kids'],
                ngoId: aNgo.id,
            })

        expect(babyPetResponse.statusCode).toEqual(201)
        const response = await request(app.server)
            .get('/pets')
            .query({
                city: aNgo.city,
                ageCategory: 'baby',
            })
            .send()

        expect(response.statusCode).toEqual(200)
        expect(response.body.pets).toHaveLength(1)
        expect(response.body.pets[0]).toEqual(
            expect.objectContaining({
                name: 'Baby Pet',
            })
        )
    })

    it('should be able to filter pets by characteristics', async () => {
        await request(app.server)
            .post('/pet/adoption')
            .set('Authorization', `Bearer ${aNgoToken}`)
            .send({
                name: 'High Energy Pet',
                birthdate: '2022-01-01',
                size: 3,
                energyLevel: 4,
                independenceLevel: 2,
                spaceForLiving: 2,
                requirements: ['Needs yard'],
                ngoId: aNgo.id,
            })

        const response = await request(app.server)
            .get('/pets')
            .query({
                city: aNgo.city,
                spaceForLiving: 2,
            })
            .send()

        console.log(response.body)

        expect(response.statusCode).toEqual(200)
        expect(response.body.pets).toHaveLength(1)
        expect(response.body.pets[0]).toEqual(
            expect.objectContaining({
                name: 'High Energy Pet',
            })
        )
    })
})
