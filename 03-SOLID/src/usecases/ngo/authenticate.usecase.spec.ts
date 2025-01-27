import { InMemoryNgoRepository } from '@/repositories/in-memory/in-memory-ngo.repository'
import { NgoRepository } from '@/repositories/ngo.repository'
import { beforeEach, expect, it } from 'vitest'
import { AuthenticateNgoUseCase } from './authenticate.usecase'
import bcrypt from 'bcryptjs'
import { Ngo } from '@prisma/client'

let ngoRepository: NgoRepository
let sup: AuthenticateNgoUseCase
let ngo: Ngo

beforeEach(async () => {
    ngoRepository = new InMemoryNgoRepository()
    sup = new AuthenticateNgoUseCase(ngoRepository)

    const validNgo = {
        name: 'NGO 1',
        email: 'ngo1@example.com',
        passwordHash: await bcrypt.hash('password123', 6),
        address: 'address1',
        zipcode: 'zipcode1',
        city: 'city1',
        state: 'state1',
        phone: 'phone1',
        latitude: 1,
        longitude: 1,
    }

    ngo = await ngoRepository.create(validNgo)
})

it('should be able to login with valid credentials', async () => {
    const result = await sup.execute({
        email: 'ngo1@example.com',
        password: 'password123',
    })

    expect(result.id).toEqual(expect.any(String))
})

it('should not be able to login with invalid credentials', async () => {
    await expect(
        sup.execute({
            email: 'ngo1@example.com',
            password: 'invalidPassword',
        })
    ).rejects.toThrow('Invalid password')
})
