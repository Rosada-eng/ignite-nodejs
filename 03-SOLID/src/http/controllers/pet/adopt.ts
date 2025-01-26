import { makeAdoptPetUseCase } from '@/usecases/factories/make-adopt-pet-usecase'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function adopt(request: FastifyRequest, reply: FastifyReply) {
    const adoptPetUseCase = await makeAdoptPetUseCase()

    const adoptPetBodySchema = z.object({
        petId: z.string(),
    })

    const inputData = adoptPetBodySchema.parse(request.body)
    const ngoId = request.user.sub

    const pet = await adoptPetUseCase.execute(inputData, ngoId)

    return reply.status(200).send({
        pet,
    })
}
