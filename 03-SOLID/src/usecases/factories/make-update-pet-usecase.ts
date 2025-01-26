import { PrismaPetRepository } from '@/repositories/prisma/prisma-pet.repository'
import { UpdatePetUseCase } from '../pet/update-pet.usecase'

export async function makeUpdatePetUseCase() {
    const petRepository = new PrismaPetRepository()
    const updatePetUseCase = new UpdatePetUseCase(petRepository)

    return updatePetUseCase
}
