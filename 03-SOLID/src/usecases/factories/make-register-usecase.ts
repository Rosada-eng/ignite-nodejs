import { PrismaNGORepository } from '@/repositories/prisma/prisma-ngo.repository'
import { RegisterNgoUseCase } from '../ngo/register.usecase'

export async function makeRegisterNgoUseCase() {
    const ngoRepository = new PrismaNGORepository()
    const registerUseCase = new RegisterNgoUseCase(ngoRepository)

    return registerUseCase
}
