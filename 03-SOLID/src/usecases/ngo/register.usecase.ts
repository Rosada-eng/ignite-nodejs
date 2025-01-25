import { NgoRepository } from '@/repositories/ngo.repository'
import { Ngo, Prisma } from '@prisma/client'
import { hash } from 'bcryptjs'

export interface RegisterNgoUseCaseProps
    extends Omit<Prisma.NgoCreateInput, 'passwordHash' | 'id' | 'pets'> {
    password: string
}

export interface RegisterNgoUseCaseResponse
    extends Omit<Ngo, 'passwordHash' | 'pets'> {}

export class RegisterNgoUseCase {
    constructor(private readonly ngoRepository: NgoRepository) {}

    async execute(
        data: RegisterNgoUseCaseProps
    ): Promise<RegisterNgoUseCaseResponse> {
        const hashedPassword = await hash(data.password, 6)

        const ngo = await this.ngoRepository.create({
            ...data,
            passwordHash: hashedPassword,
        })

        return {
            id: ngo.id,
            name: ngo.name,
            email: ngo.email,
            address: ngo.address,
            zipcode: ngo.zipcode,
            city: ngo.city,
            state: ngo.state,
            phone: ngo.phone,
            latitude: ngo.latitude,
            longitude: ngo.longitude,
        }
    }
}
