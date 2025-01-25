import { randomUUID } from 'crypto'
import { beforeEach, it, expect } from 'vitest'

import { InMemoryPetRepository } from '@/repositories/in-memory/in-memory-pet.repository'
import { AdoptPetUseCase } from './adopt-pet.usecase'
import { PetRepository } from '@/repositories/pet.repository'

let petRepository: PetRepository
let sut: AdoptPetUseCase
let authorId: string

beforeEach(() => {
    petRepository = new InMemoryPetRepository()
    sut = new AdoptPetUseCase(petRepository)
    authorId = randomUUID()
})

it('should be able to adopt an available pet owned by the same NGO', async () => {
    const ngoId = randomUUID()
    authorId = ngoId

    const validPet = await petRepository.create({
        name: 'validPet',
        birthdate: new Date(),
        size: 1,
        energyLevel: 1,
        independenceLevel: 1,
        spaceForLiving: 1,
        ngoId,
    })

    await sut.execute({ petId: validPet.id }, authorId)

    const pet = await petRepository.findById(validPet.id)

    expect(pet?.adopted_at).not.toBeNull()
})

it('should not be able to adopt a pet that is already adopted', async () => {
    const ngoId = randomUUID()
    authorId = ngoId

    const validPet = await petRepository.create({
        name: 'validPet',
        birthdate: new Date(),
        size: 1,
        energyLevel: 1,
        independenceLevel: 1,
        spaceForLiving: 1,
        ngoId,
        adopted_at: new Date(),
    })

    await expect(sut.execute({ petId: validPet.id }, authorId)).rejects.toThrow(
        'Pet already adopted'
    )
})

it('should not be able to adopt a pet that does not belong to the same NGO', async () => {
    const ngoId = randomUUID()

    const validPet = await petRepository.create({
        name: 'validPet',
        birthdate: new Date(),
        size: 1,
        energyLevel: 1,
        independenceLevel: 1,
        spaceForLiving: 1,
        ngoId,
    })

    await expect(sut.execute({ petId: validPet.id }, authorId)).rejects.toThrow(
        'This pet does not belong to this NGO'
    )
})
