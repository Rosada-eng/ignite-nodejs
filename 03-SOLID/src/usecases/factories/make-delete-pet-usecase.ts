import { PrismaPetRepository } from '@/repositories/prisma/prisma-pet.repository'
import { DeletePetUseCase } from '../pet/delete-pet.usecase'

export async function makeDeletePetUseCase() {
    const petRepository = new PrismaPetRepository()
    const deletePetUseCase = new DeletePetUseCase(petRepository)

    return deletePetUseCase
}
