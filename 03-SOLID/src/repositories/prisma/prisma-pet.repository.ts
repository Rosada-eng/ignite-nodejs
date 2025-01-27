import { prisma } from '@/lib/prisma'
import { Pet, Prisma } from '@prisma/client'
import { PetRepository } from '../pet.repository'
import {
    convertCategoryIntoRange,
    ListAvailablePetsUseCaseFilters,
} from '@/usecases/pet/list-available-pets.usecase'

export class PrismaPetRepository implements PetRepository {
    async create(data: Prisma.PetUncheckedCreateInput) {
        return await prisma.pet.create({
            data,
        })
    }

    async delete(petId: string) {
        await prisma.pet.delete({
            where: {
                id: petId,
            },
        })
    }

    async findById(petId: string) {
        return await prisma.pet.findUnique({
            where: {
                id: petId,
            },
        })
    }

    async update(pet: Pet) {
        return await prisma.pet.update({
            where: {
                id: pet.id,
            },
            data: pet,
        })
    }

    async listAvailablePets(
        city: string,
        filters: ListAvailablePetsUseCaseFilters
    ) {
        const conditions = []

        if (filters.ageCategory) {
            const ageCategoryRange = convertCategoryIntoRange(
                filters.ageCategory
            )
            conditions.push(Prisma.sql`
                EXTRACT(YEAR FROM AGE(CURRENT_DATE, pet.birthdate)) 
                BETWEEN ${ageCategoryRange.min} AND ${ageCategoryRange.max}
            `)
        }

        if (filters.size) {
            conditions.push(Prisma.sql`pet.size = ${filters.size}`)
        }

        if (filters.energyLevel) {
            conditions.push(
                Prisma.sql`pet.energy_level = ${filters.energyLevel}`
            )
        }

        if (filters.independenceLevel) {
            conditions.push(
                Prisma.sql`pet.independence_level = ${filters.independenceLevel}`
            )
        }

        const whereClause =
            conditions.length > 0
                ? Prisma.sql` AND ${Prisma.join(conditions, ' AND ')}`
                : Prisma.empty

        const rawQuery = Prisma.sql`
            SELECT 
                pet.id,
                pet.name,
                pet.birthdate,
                pet.size,
                pet.energy_level,
                pet.independence_level,
                pet.space_for_living,
                pet.requirements,
                ngo.name AS ngo_name,
                ngo.email AS ngo_email,
                ngo.phone AS ngo_phone
            FROM pet
            INNER JOIN ngo ON ngo.id = pet.ngo_id
            WHERE ngo.city = ${city}
            ${whereClause}
        `

        return await prisma.$queryRaw<Pet[]>(rawQuery)
    }
}
