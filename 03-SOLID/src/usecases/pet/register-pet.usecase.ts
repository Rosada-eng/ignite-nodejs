import { NgoRepository } from '@/repositories/ngo.repository'
import { PetRepository } from '@/repositories/pet.repository'

export interface RegisterPetUsecaseProps {
    name: string
    birthdate: Date
    size: number
    energyLevel: number
    independenceLevel: number
    spaceForLiving: number
    requirements: string[]
    ngoId: string
}

export class RegisterPetUsecase {
    constructor(
        private readonly petRepository: PetRepository,
        private readonly ngoRepository: NgoRepository
    ) {}

    async execute(data: RegisterPetUsecaseProps, authorId: string) {
        const ngo = await this.ngoRepository.findById(data.ngoId)

        if (!ngo) {
            throw new Error('Invalid NGO')
        }

        if (ngo.id !== authorId) {
            throw new Error('This NGO does not belong to this user')
        }

        if (data.requirements.length === 0) {
            throw new Error('Requirements are required')
        }

        return this.petRepository.create(data)
    }
}
