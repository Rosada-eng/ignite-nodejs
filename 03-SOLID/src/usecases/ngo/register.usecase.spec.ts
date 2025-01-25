import { beforeEach, expect, it } from 'vitest'
import { RegisterNgoUseCase } from './register.usecase'
import { InMemoryNgoRepository } from '@/repositories/in-memory/in-memory-ngo.repository'
import { NgoRepository } from '@/repositories/ngo.repository'

let ngoRepository: NgoRepository
let sut: RegisterNgoUseCase

beforeEach(() => {
    ngoRepository = new InMemoryNgoRepository()
    sut = new RegisterNgoUseCase(ngoRepository)
})

it('should be able to register a valid NGO', async () => {
    const validNgoDataInput = {
        name: 'validNgo',
        email: 'validNgo@example.com',
        password: 'validNgo',
        address: 'valid street',
        zipcode: '12345678',
        city: 'big city',
        state: 'big state',
        phone: '99999999999',
        latitude: 123,
        longitude: 456,
    }

    const validNgo = await sut.execute(validNgoDataInput)

    const { password, ...validNgoDataInputWithoutPassword } = validNgoDataInput

    expect(validNgo).toMatchObject(validNgoDataInputWithoutPassword)
})

it('should not be able to register a NGO with an existing email', async () => {
    const validNgoDataInput = {
        name: 'validNgo',
        email: 'validNgo@example.com',
        password: 'validNgo',
        address: 'valid street',
        zipcode: '12345678',
        city: 'big city',
        state: 'big state',
        phone: '99999999999',
        latitude: 123,
        longitude: 456,
    }

    await sut.execute(validNgoDataInput)

    await expect(sut.execute(validNgoDataInput)).rejects.toThrow(Error)
})
