import { NgoRepository } from '@/repositories/ngo.repository'
import { Ngo } from '@prisma/client'
import { compare } from 'bcryptjs'

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

        const isPasswordValid = await compare(data.password, ngo.passwordHash)

        if (!isPasswordValid) {
            throw new Error('Invalid password')
        }

        const { passwordHash, ...ngoWithoutPassword } = ngo
        return {
            ngo: ngoWithoutPassword,
        }
    }
}
