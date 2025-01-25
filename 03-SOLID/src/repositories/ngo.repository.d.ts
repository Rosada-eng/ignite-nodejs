import { Prisma, Ngo } from '@prisma/client'

export interface NgoRepository {
    create(data: Prisma.NgoCreateInput): Promise<Ngo>
    findById(id: string): Promise<Ngo | null>
    findByEmail(email: string): Promise<Ngo>
}
