import { NgoRepository } from '@/repositories/ngo.repository'
import { compare } from 'bcryptjs'

export interface LoginNgoUseCaseProps {
    email: string
    password: string
}

export class LoginNgoUseCase {
    constructor(private readonly ngoRepository: NgoRepository) {}

    async execute(data: LoginNgoUseCaseProps) {
        const ngo = await this.ngoRepository.findByEmail(data.email)

        const isPasswordValid = await compare(data.password, ngo.passwordHash)

        if (!isPasswordValid) {
            throw new Error('Invalid password')
        }

        // TODO: implement refresh token

        return {
            token: 'token123',
        }
    }
}
