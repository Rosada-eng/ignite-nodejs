import { Ngo, Pet, Prisma } from '@prisma/client'
import { PetRepository } from '../pet.repository'
import { randomUUID } from 'crypto'
import { convertCategoryIntoRange } from '@/usecases/pet/list-available-pets.usecase'
import { ListAvailablePetsUseCaseFilters } from '@/usecases/pet/list-available-pets.usecase'

export class InMemoryPetRepository implements PetRepository {
    public pets: Pet[] = []
    public ngos: Ngo[] = []

    async create(data: Prisma.PetUncheckedCreateInput) {
        const pet = {
            ...data,
            id: data.id ? data.id : randomUUID(),
        } as Pet

        this.pets.push(pet)
        return pet
    }

    async delete(petId: string) {
        this.pets = this.pets.filter(pet => pet.id !== petId)
    }

    async findById(petId: string) {
        const pet = this.pets.find(pet => pet.id === petId)
        return pet || null
    }

    async update(pet: Pet) {
        const petIndex = this.pets.findIndex(pet => pet.id === pet.id)

        if (petIndex === -1) {
            throw new Error('Pet not found')
        }

        const newPet = {
            ...this.pets[petIndex],
            ...pet,
        } as Pet

        this.pets[petIndex] = newPet

        return newPet
    }

    async listAvailablePets(
        city: string,
        filters: ListAvailablePetsUseCaseFilters
    ) {
        const inCityNgoIds = this.ngos
            .filter(ngo => ngo.city === city)
            .map(ngo => ngo.id)

        if (inCityNgoIds.length === 0) return []

        const filteredPets = this.pets.filter(pet => {
            if (!inCityNgoIds.includes(pet.ngoId)) return false

            if (filters.ageCategory) {
                const ageCategoryRange = convertCategoryIntoRange(
                    filters.ageCategory
                )
                const age =
                    new Date().getFullYear() -
                    new Date(pet.birthdate).getFullYear()
                if (age < ageCategoryRange.min || age > ageCategoryRange.max)
                    return false
            }

            if (filters.size && pet.size !== filters.size) return false

            if (filters.energyLevel && pet.energyLevel !== filters.energyLevel)
                return false

            if (
                filters.independenceLevel &&
                pet.independenceLevel !== filters.independenceLevel
            )
                return false

            return true
        })

        return filteredPets
    }
}
