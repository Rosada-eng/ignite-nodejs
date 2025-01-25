import { Prisma, Pet } from '@prisma/client'

export interface PetRepository {
    create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
    delete(petId: string): Promise<void>
    findById(petId: string): Promise<Pet | null>
}
