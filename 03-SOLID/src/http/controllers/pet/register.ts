import { makeRegisterPetUseCase } from '@/usecases/factories/make-register-pet-usecase'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerPetUseCase = await makeRegisterPetUseCase()

    const registerPetBodySchema = z.object({
        name: z.string(),
        birthdate: z.coerce.date(),
        size: z.number().min(1).max(3),
        energyLevel: z.number().min(1).max(5),
        independenceLevel: z.number().min(1).max(5),
        spaceForLiving: z.number().min(1).max(3),
        requirements: z.array(z.string()),
    })

    const inputData = registerPetBodySchema.parse(request.body)
    const ngoId = request.user.sub

    const pet = await registerPetUseCase.execute(
        {
            ...inputData,
            ngoId,
        },
        ngoId
    )
    return reply.status(201).send({
        pet,
    })
}
