import { makeRegisterNgoUseCase } from '@/usecases/factories/make-register-ngo-usecase'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerNgoUseCase = await makeRegisterNgoUseCase()

    const registerNgoBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(8),
        address: z.string(),
        zipcode: z.string(),
        city: z.string(),
        state: z.string(),
        phone: z.string(),
        latitude: z.number(),
        longitude: z.number(),
    })

    const inputData = registerNgoBodySchema.parse(request.body)

    const ngo = await registerNgoUseCase.execute(inputData)

    return reply.status(201).send({
        ngo,
    })
}
