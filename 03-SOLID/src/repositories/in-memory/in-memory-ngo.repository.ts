import { Ngo, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { NgoRepository } from '../ngo.repository'
export class InMemoryNgoRepository implements NgoRepository {
    public data: Ngo[] = []

    findById(id: string) {
        return this.data.find(ngo => ngo.id === id)
    }

    create(data: Prisma.NgoCreateInput) {
        const newNgo = {
            ...data,
            id: data.id ? data.id : randomUUID(),
        }
        this.data.push(newNgo)

        return newNgo
    }
}
