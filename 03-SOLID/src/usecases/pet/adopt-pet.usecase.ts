import { PetRepository } from '@/repositories/pet.repository'

export interface AdoptPetUseCaseProps {
    petId: string
}

export class AdoptPetUseCase {
    constructor(private readonly petRepository: PetRepository) {}

    async execute({ petId }: AdoptPetUseCaseProps, authorId: string) {
        const pet = await this.petRepository.findById(petId)

        if (!pet) {
            throw new Error('Pet not found')
        }

        if (pet.ngoId !== authorId) {
            throw new Error('This pet does not belong to this NGO')
        }

        if (pet.adopted_at) {
            throw new Error('Pet already adopted')
        }

        const adoptedPet = await this.petRepository.update({
            ...pet,
            adopted_at: new Date(),
        })

        return adoptedPet
    }
}
