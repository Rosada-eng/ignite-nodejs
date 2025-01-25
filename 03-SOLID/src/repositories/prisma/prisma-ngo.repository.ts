import { prisma } from '@/lib/prisma'
import { Ngo, Prisma } from '@prisma/client'
import { NgoRepository } from '../ngo.repository'

export class PrismaNGORepository implements NgoRepository {
    async findById(id: string) {
        return await prisma.ngo.findUniqueOrThrow({
            where: {
                id,
            },
        })
    }
    async create(ngo: Prisma.NgoCreateInput) {
        return await prisma.ngo.create({
            data: ngo,
        })
    }
}
