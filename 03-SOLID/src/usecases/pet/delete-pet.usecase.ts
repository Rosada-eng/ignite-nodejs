import { PetRepository } from '@/repositories/pet.repository'

export interface DeletePetUseCaseProps {
    petId: string
    ngoId: string
}

export class DeletePetUseCase {
    constructor(private readonly petRepository: PetRepository) {}

    async execute(data: DeletePetUseCaseProps) {
        const pet = await this.petRepository.findById(data.petId)

        if (!pet) {
            throw new Error('Pet not found')
        }

        if (pet.ngoId !== data.ngoId) {
            throw new Error('This pet does not belong to this NGO')
        }

        await this.petRepository.delete(data.petId)
    }
}
