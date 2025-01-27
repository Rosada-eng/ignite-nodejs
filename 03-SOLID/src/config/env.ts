import { z } from 'zod'
import 'dotenv/config'

export const envSchema = z.object({
    NODE_ENV: z.enum(['dev', 'prod', 'test']).default('dev'),
    DATABASE_URL: z.string(),
    PORT: z.coerce.number().default(3333),
})

export const env = envSchema.parse(process.env)
