import { Ngo, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { NgoRepository } from '../ngo.repository'
export class InMemoryNgoRepository implements NgoRepository {
    public data: Ngo[] = []

    async findById(id: string) {
        return this.data.find(ngo => ngo.id === id) || null
    }

    async create(data: Prisma.NgoCreateInput) {
        const ngoWithSameEmail = this.data.find(ngo => ngo.email === data.email)

        if (ngoWithSameEmail) {
            throw new Error('NGO with this email already exists.')
        }

        const newNgo = {
            ...data,
            id: data.id ? data.id : randomUUID(),
        }
        this.data.push(newNgo)

        return newNgo
    }

    async findByEmail(email: string) {
        const ngo = this.data.find(ngo => ngo.email === email)

        if (!ngo) {
            throw new Error('NGO not found')
        }

        return ngo
    }
}
