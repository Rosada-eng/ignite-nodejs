import { Ngo, Pet, Prisma } from '@prisma/client'
import { PetRepository } from '../pet.repository'
import { randomUUID } from 'crypto'

export class InMemoryPetRepository implements PetRepository {
    public pets: Pet[] = []

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
}
