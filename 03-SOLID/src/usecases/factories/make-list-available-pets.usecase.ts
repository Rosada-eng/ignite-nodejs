import { PrismaPetRepository } from '@/repositories/prisma/prisma-pet.repository'
import { ListAvailablePetsUseCase } from '../pet/list-available-pets.usecase'

export function makeListAvailablePetsUseCase() {
    const petRepository = new PrismaPetRepository()
    const useCase = new ListAvailablePetsUseCase(petRepository)

    return useCase
}
