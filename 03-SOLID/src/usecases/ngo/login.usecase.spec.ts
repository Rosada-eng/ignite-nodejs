import { InMemoryNgoRepository } from '@/repositories/in-memory/in-memory-ngo.repository'
import { NgoRepository } from '@/repositories/ngo.repository'
import { beforeEach, expect, it } from 'vitest'
import { LoginNgoUseCase } from './login.usecase'
import { hash } from 'bcryptjs'

let ngoRepository: NgoRepository
let sup: LoginNgoUseCase

beforeEach(async () => {
    ngoRepository = new InMemoryNgoRepository()
    sup = new LoginNgoUseCase(ngoRepository)

    const validNgo = {
        name: 'NGO 1',
        email: 'ngo1@example.com',
        passwordHash: await hash('password123', 6),
        address: 'address1',
        zipcode: 'zipcode1',
        city: 'city1',
        state: 'state1',
        phone: 'phone1',
        latitude: 1,
        longitude: 1,
    }

    const ngo = await ngoRepository.create(validNgo)
})

it('should be able to login with valid credentials', async () => {
    const result = await sup.execute({
        email: 'ngo1@example.com',
        password: 'password123',
    })

    expect(result).toEqual({
        token: 'token123',
    })
})

it('should not be able to login with invalid credentials', async () => {
    await expect(
        sup.execute({
            email: 'ngo1@example.com',
            password: 'invalidPassword',
        })
    ).rejects.toThrow('Invalid password')
})
