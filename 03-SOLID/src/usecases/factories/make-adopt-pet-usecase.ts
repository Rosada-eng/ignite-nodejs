import { PrismaPetRepository } from '@/repositories/prisma/prisma-pet.repository'
import { AdoptPetUseCase } from '../pet/adopt-pet.usecase'

export async function makeAdoptPetUseCase() {
    const petRepository = new PrismaPetRepository()
    const adoptPetUseCase = new AdoptPetUseCase(petRepository)

    return adoptPetUseCase
}
