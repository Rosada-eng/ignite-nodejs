import { PetRepository } from '@/repositories/pet.repository'
import { UpdatePetUseCase } from './update-pet.usecase'
import { InMemoryPetRepository } from '@/repositories/in-memory/in-memory-pet.repository'
import { beforeEach, expect, it } from 'vitest'
import { randomUUID } from 'crypto'

let petRepository: PetRepository
let updatePetUseCase: UpdatePetUseCase
let authorId: string

beforeEach(() => {
    petRepository = new InMemoryPetRepository()
    updatePetUseCase = new UpdatePetUseCase(petRepository)
    authorId = randomUUID()
})

it('should be able toupdate a pet owned by the same NGO', async () => {
    const validNGOId = randomUUID()
    authorId = validNGOId

    const pet = await petRepository.create({
        name: 'Test',
        birthdate: new Date(),
        size: 1,
        energyLevel: 1,
        independenceLevel: 1,
        spaceForLiving: 1,
        ngoId: validNGOId,
    })

    await updatePetUseCase.execute(
        {
            id: pet.id,
            name: 'changed his name',
        },
        authorId
    )

    const updatedPet = await petRepository.findById(pet.id)

    expect(updatedPet?.name).toBe('changed his name')
})

it('should not be able to update a pet owned by a different NGO', async () => {
    const validNGOId = randomUUID()

    const pet = await petRepository.create({
        name: 'Test',
        birthdate: new Date(),
        size: 1,
        energyLevel: 1,
        independenceLevel: 1,
        spaceForLiving: 1,
        ngoId: validNGOId,
    })

    await expect(
        updatePetUseCase.execute(
            {
                id: pet.id,
                name: 'changed his name',
            },
            authorId
        )
    ).rejects.toThrow('This pet does not belong to this NGO')
})
