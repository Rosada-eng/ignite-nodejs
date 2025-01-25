import { DeletePetUseCase, DeletePetUseCaseProps } from './delete-pet.usecase'
import { InMemoryPetRepository } from '@/repositories/in-memory/in-memory-pet.repository'
import { PetRepository } from '@/repositories/pet.repository'
import { randomUUID } from 'crypto'
import { test, expect, it, beforeEach } from 'vitest'

let petRepository: PetRepository
let sut: DeletePetUseCase
let authorId: string

beforeEach(() => {
    petRepository = new InMemoryPetRepository()
    sut = new DeletePetUseCase(petRepository)
    authorId = randomUUID()
})

it('should be able to delete a pet registered by the same NGO', async () => {
    const ngoId = randomUUID()
    const petId = randomUUID()

    authorId = ngoId
    const validPet = {
        id: petId,
        name: 'validPet',
        birthdate: new Date(),
        size: 1,
        energyLevel: 1,
        independenceLevel: 1,
        spaceForLiving: 1,
        ngoId: ngoId,
    }

    await petRepository.create(validPet)

    const validInputData: DeletePetUseCaseProps = {
        petId: petId,
    }

    await expect(sut.execute(validInputData, authorId)).resolves.toBeUndefined()

    const pet = await petRepository.findById(petId)

    expect(pet).toBeNull()
})

it('should NOT be able to delete a pet registered by another NGO', async () => {
    const anotherNgoId = randomUUID()
    const petId = randomUUID()

    const validPet = {
        id: petId,
        name: 'validPet',
        birthdate: new Date(),
        size: 1,
        energyLevel: 1,
        independenceLevel: 1,
        spaceForLiving: 1,
        ngoId: anotherNgoId,
    }

    await petRepository.create(validPet)

    const invalidInputData: DeletePetUseCaseProps = {
        petId: petId,
    }

    await expect(sut.execute(invalidInputData, authorId)).rejects.toThrow()
})

it('should NOT be able to delete a pet that does not exist', async () => {
    const invalidInputData: DeletePetUseCaseProps = {
        petId: 'notValidPetId',
    }

    await expect(sut.execute(invalidInputData, authorId)).rejects.toThrow()
})
