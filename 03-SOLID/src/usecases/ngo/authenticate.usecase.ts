import { NgoRepository } from '@/repositories/ngo.repository'
import { Ngo } from '@prisma/client'
import bcrypt from 'bcryptjs'

export interface AuthenticateNgoUseCaseProps {
    email: string
    password: string
}

export interface AuthenticateNgoUseCaseResponse
    extends Omit<Ngo, 'passwordHash'> {}

export class AuthenticateNgoUseCase {
    constructor(private readonly ngoRepository: NgoRepository) {}

    async execute(data: AuthenticateNgoUseCaseProps) {
        const ngo = await this.ngoRepository.findByEmail(data.email)

        const isPasswordValid = await bcrypt.compare(
            data.password,
            ngo.passwordHash
        )

        if (!isPasswordValid) {
            throw new Error('Invalid password')
        }

        return {
            id: ngo.id,
        }
    }
}
