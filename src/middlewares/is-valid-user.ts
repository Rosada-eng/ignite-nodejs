import { FastifyReply } from "fastify";
import { FastifyRequest } from "fastify"
import { knex } from "src/config/database";

export async function isValidUser(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.cookies.userId

    if (!userId) {
        return reply.status(401).send({ message: "Unauthorized" })
    }

    const user = await knex("users").where("id", userId).first()

    if (!user) {
        return reply.status(401).send({ message: "Unauthorized" })
    }

}