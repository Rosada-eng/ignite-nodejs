import { InMemoryPetRepository } from '@/repositories/in-memory/in-memory-pet.repository'
import { ListAvailablePetsUseCase } from './list-available-pets.usecase'
import { beforeEach, describe, expect, it } from 'vitest'

describe('List Available Pets Use Case', () => {
    let petRepository: InMemoryPetRepository
    let sut: ListAvailablePetsUseCase

    beforeEach(() => {
        petRepository = new InMemoryPetRepository()
        sut = new ListAvailablePetsUseCase(petRepository)
    })

    it('should be able to list available pets in a city', async () => {
        const ngo = {
            id: 'ngo-01',
            name: 'NGO Test',
            email: 'ngo@example.com',
            passwordHash: '123456',
            address: 'Address test',
            zipcode: '00000-000',
            phone: '11999999999',
            city: 'São Paulo',
            state: 'SP',
            latitude: 0,
            longitude: 0,
        }

        petRepository.ngos.push(ngo)

        await petRepository.create({
            id: 'pet-01',
            name: 'Pet 01',
            birthdate: new Date('2023-01-01'),
            size: 1,
            energyLevel: 4,
            independenceLevel: 2,
            spaceForLiving: 3,
            requirements: ['requirement 1'],
            ngoId: ngo.id,
        })

        const pets = await sut.execute('São Paulo', {})

        expect(pets).toHaveLength(1)
        expect(pets[0].id).toBe('pet-01')
    })

    it('should filter pets by age category', async () => {
        const ngo = {
            id: 'ngo-01',
            name: 'NGO Test',
            email: 'ngo@example.com',
            passwordHash: '123456',
            address: 'Address test',
            zipcode: '00000-000',
            phone: '11999999999',
            city: 'São Paulo',
            state: 'SP',
            latitude: 0,
            longitude: 0,
        }

        petRepository.ngos.push(ngo)

        await petRepository.create({
            id: 'young-pet',
            name: 'Young Pet',
            birthdate: new Date(new Date().getFullYear() - 2, 0, 1),
            size: 1,
            energyLevel: 4,
            independenceLevel: 2,
            spaceForLiving: 3,
            requirements: [],
            ngoId: ngo.id,
        })

        await petRepository.create({
            id: 'senior-pet',
            name: 'Senior Pet',
            birthdate: new Date(new Date().getFullYear() - 10, 0, 1),
            size: 1,
            energyLevel: 4,
            independenceLevel: 2,
            spaceForLiving: 3,
            requirements: [],
            ngoId: ngo.id,
        })

        const youngPets = await sut.execute('São Paulo', {
            ageCategory: 'young',
        })
        expect(youngPets).toHaveLength(1)
        expect(youngPets[0].id).toBe('young-pet')

        const seniorPets = await sut.execute('São Paulo', {
            ageCategory: 'senior',
        })
        expect(seniorPets).toHaveLength(1)
        expect(seniorPets[0].id).toBe('senior-pet')
    })

    it('should filter pets by characteristics', async () => {
        const ngo = {
            id: 'ngo-01',
            name: 'NGO Test',
            email: 'ngo@example.com',
            passwordHash: '123456',
            address: 'Address test',
            zipcode: '00000-000',
            phone: '11999999999',
            city: 'Limeira',
            state: 'SP',
            latitude: 0,
            longitude: 0,
        }

        petRepository.ngos.push(ngo)

        await petRepository.create({
            id: 'pet-01',
            name: 'Pet 01',
            birthdate: new Date('2023-01-01'),
            size: 1,
            energyLevel: 4,
            independenceLevel: 2,
            spaceForLiving: 3,
            requirements: [],
            ngoId: ngo.id,
        })

        await petRepository.create({
            id: 'pet-02',
            name: 'Pet 02',
            birthdate: new Date('2023-01-01'),
            size: 2,
            energyLevel: 5,
            independenceLevel: 3,
            spaceForLiving: 4,
            requirements: [],
            ngoId: ngo.id,
        })

        const filteredPets = await sut.execute(ngo.city, {
            size: 1,
            energyLevel: 4,
            independenceLevel: 2,
        })

        console.log(filteredPets)

        expect(filteredPets).toHaveLength(1)
        expect(filteredPets[0].id).toBe('pet-01')
    })

    it('should return empty array when no NGOs are found in the city', async () => {
        const pets = await sut.execute('Non-existent City', {})
        expect(pets).toHaveLength(0)
    })
})
