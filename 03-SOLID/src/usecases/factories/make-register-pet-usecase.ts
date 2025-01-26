import { PrismaPetRepository } from '@/repositories/prisma/prisma-pet.repository'
import { RegisterPetUsecase } from '../pet/register-pet.usecase'
import { PrismaNGORepository } from '@/repositories/prisma/prisma-ngo.repository'

export async function makeRegisterPetUseCase() {
    const petRepository = new PrismaPetRepository()
    const ngoRepository = new PrismaNGORepository()
    const registerUseCase = new RegisterPetUsecase(petRepository, ngoRepository)

    return registerUseCase
}
