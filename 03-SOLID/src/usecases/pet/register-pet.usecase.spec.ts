import { NgoRepository } from '@/repositories/ngo.repository'
import { PetRepository } from '@/repositories/pet.repository'
import { Pet } from '@prisma/client'
import { test, expect, it, beforeEach } from 'vitest'
import {
    RegisterPetUsecase,
    RegisterPetUsecaseProps,
} from './register-pet.usecase'
import { InMemoryPetRepository } from '@/repositories/in-memory/in-memory-pet.repository'
import { InMemoryNgoRepository } from '@/repositories/in-memory/in-memory-ngo.repository'
import { randomUUID } from 'crypto'
let petRepository: PetRepository
let ngoRepository: NgoRepository
let sut: RegisterPetUsecase

beforeEach(() => {
    petRepository = new InMemoryPetRepository()
    ngoRepository = new InMemoryNgoRepository()
    sut = new RegisterPetUsecase(petRepository, ngoRepository)
})

it('should be able to register a pet with valid ngo and requirements set', async () => {
    const validNgo = {
        id: randomUUID(),
        name: 'valid ngo',
        email: 'valid@ngo.com',
        passwordHash: 'valid password',
        latitude: 0,
        longitude: 0,
        address: 'valid address',
        zipcode: 'valid zipcode',
        city: 'valid city',
        state: 'valid state',
        phone: 'valid phone',
    }

    await ngoRepository.create(validNgo)

    const inputData: RegisterPetUsecaseProps = {
        name: 'doguinho',
        description: 'a very friendly dog',
        birthdate: new Date(),
        size: 1,
        energyLevel: 1,
        independenceLevel: 1,
        spaceForLiving: 1,
        requirements: ['requirement 1'],
        ngoId: validNgo.id,
    }

    const result = await sut.execute(inputData)

    expect(result.id).toBeTruthy()
})

it('should NOT be able to register a pet with invalid ngo', async () => {
    const invalidInputData: RegisterPetUsecaseProps = {
        name: 'doguinho',
        description: 'a very friendly dog',
        birthdate: new Date(),
        size: 1,
        energyLevel: 1,
        independenceLevel: 1,
        spaceForLiving: 1,
        requirements: ['requirement 1'],
        ngoId: 'invalid ngo id',
    }

    expect(async () => await sut.execute(invalidInputData)).rejects.toThrow(
        Error
    )
})

it('should NOT be able to register a pet without requirements', async () => {
    const validNgo = {
        id: randomUUID(),
        name: 'valid ngo',
        email: 'valid@ngo.com',
        passwordHash: 'valid password',
        latitude: 0,
        longitude: 0,
        address: 'valid address',
        zipcode: 'valid zipcode',
        city: 'valid city',
        state: 'valid state',
        phone: 'valid phone',
    }

    await ngoRepository.create(validNgo)

    const invalidInputData: RegisterPetUsecaseProps = {
        name: 'doguinho',
        description: 'a very friendly dog',
        birthdate: new Date(),
        size: 1,
        energyLevel: 1,
        independenceLevel: 1,
        spaceForLiving: 1,
        requirements: [],
        ngoId: validNgo.id,
    }

    expect(async () => await sut.execute(invalidInputData)).rejects.toThrow(
        Error
    )
})
