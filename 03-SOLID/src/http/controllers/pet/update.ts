import { makeUpdatePetUseCase } from '@/usecases/factories/make-update-pet-usecase'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function update(request: FastifyRequest, reply: FastifyReply) {
    const updatePetUseCase = await makeUpdatePetUseCase()

    const updatePetBodySchema = z.object({
        petId: z.string(),
        name: z.string().optional(),
        birthdate: z.coerce.date().optional(),
        size: z.number().min(1).max(3).optional(),
        energyLevel: z.number().min(1).max(5).optional(),
        independenceLevel: z.number().min(1).max(5).optional(),
        spaceForLiving: z.number().min(1).max(3).optional(),
        requirements: z.array(z.string()).optional(),
    })

    const { petId, ...inputData } = updatePetBodySchema.parse(request.body)
    const ngoId = request.user.sub

    const pet = await updatePetUseCase.execute(
        {
            id: petId,
            ...inputData,
        },
        ngoId
    )
    return reply.status(200).send({
        pet,
    })
}
