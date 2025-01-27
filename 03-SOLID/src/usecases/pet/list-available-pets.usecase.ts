import { NgoRepository } from '@/repositories/ngo.repository'
import { PetRepository } from '@/repositories/pet.repository'

export type AgeCategory = 'baby' | 'young' | 'adult' | 'senior'

export interface ListAvailablePetsUseCaseFilters {
    ageCategory?: AgeCategory
    energyLevel?: number
    independenceLevel?: number
    size?: number
    spaceForLiving?: number
}

export function convertCategoryIntoRange(ageCategory: AgeCategory) {
    return {
        baby: { min: 0, max: 1 },
        young: { min: 1, max: 3 },
        adult: { min: 3, max: 8 },
        senior: { min: 8, max: 100 },
    }[ageCategory]
}

export class ListAvailablePetsUseCase {
    constructor(private readonly petRepository: PetRepository) {}

    async execute(city: string, filters: ListAvailablePetsUseCaseFilters) {
        const pets = await this.petRepository.listAvailablePets(city, filters)
        return pets
    }
}
