import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { PetRepository } from '../pet.repository'

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
}
