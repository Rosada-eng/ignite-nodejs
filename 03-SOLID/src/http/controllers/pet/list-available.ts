import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeListAvailablePetsUseCase } from '@/usecases/factories/make-list-available-pets.usecase'

export async function listAvailablePets(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const querySchema = z.object({
        city: z.string().min(1),
        ageCategory: z.enum(['baby', 'young', 'adult', 'senior']).optional(),
        energyLevel: z.coerce.number().min(1).max(5).optional(),
        independenceLevel: z.coerce.number().min(1).max(5).optional(),
        size: z.coerce.number().min(1).max(3).optional(),
        spaceForLiving: z.coerce.number().min(1).max(3).optional(),
    })

    const query = querySchema.parse(request.query)

    const listAvailablePetsUseCase = makeListAvailablePetsUseCase()

    const pets = await listAvailablePetsUseCase.execute(query.city, {
        ageCategory: query.ageCategory,
        energyLevel: query.energyLevel,
        independenceLevel: query.independenceLevel,
        size: query.size,
        spaceForLiving: query.spaceForLiving,
    })

    return reply.status(200).send({ pets })
}
