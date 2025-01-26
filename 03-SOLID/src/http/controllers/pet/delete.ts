import { makeDeletePetUseCase } from '@/usecases/factories/make-delete-pet-usecase'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function remove(request: FastifyRequest, reply: FastifyReply) {
    const deletePetUseCase = await makeDeletePetUseCase()

    const deletePetBodySchema = z.object({
        petId: z.string(),
    })

    const { petId } = deletePetBodySchema.parse(request.body)
    const ngoId = request.user.sub

    await deletePetUseCase.execute(
        {
            petId,
        },
        ngoId
    )

    return reply.status(200).send()
}
