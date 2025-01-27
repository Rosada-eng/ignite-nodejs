import { makeAuthenticateNgoUseCase } from '@/usecases/factories/make-authenticate-usecase'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function authenticate(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const authenticateNgoUseCase = await makeAuthenticateNgoUseCase()

    const authenticateNgoBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(8),
    })

    const inputData = authenticateNgoBodySchema.parse(request.body)

    const { id } = await authenticateNgoUseCase.execute(inputData)

    const token = await reply.jwtSign(
        { sub: id },
        { sign: { expiresIn: '30m' } }
    )

    return reply.status(200).send({
        token,
    })
}
