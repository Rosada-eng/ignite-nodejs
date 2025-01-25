import { Prisma, Ngo } from '@prisma/client'

export interface NgoRepository {
    create(data: Prisma.NgoCreateInput)
    findById(id: string)
}
