import { PrismaNGORepository } from '@/repositories/prisma/prisma-ngo.repository'
import { AuthenticateNgoUseCase } from '@/usecases/ngo/authenticate.usecase'

export async function makeAuthenticateNgoUseCase() {
    const ngoRepository = new PrismaNGORepository()
    const authenticateUseCase = new AuthenticateNgoUseCase(ngoRepository)

    return authenticateUseCase
}
