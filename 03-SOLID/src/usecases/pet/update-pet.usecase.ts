import { Pet } from '@prisma/client'
import { PetRepository } from '@/repositories/pet.repository'

export interface UpdatePetUseCaseProps extends Omit<Partial<Pet>, 'ngo'> {
    id: string
}

export class UpdatePetUseCase {
    constructor(private readonly petRepository: PetRepository) {}

    async execute(
        { id: petId, ...data }: UpdatePetUseCaseProps,
        authorId: string
    ) {
        const pet = await this.petRepository.findById(petId)

        if (!pet) {
            throw new Error('Pet not found')
        }

        if (pet.ngoId !== authorId) {
            throw new Error('This pet does not belong to this NGO')
        }

        const updatedPet = await this.petRepository.update({
            ...pet,
            ...data,
        })

        return updatedPet
    }
}
