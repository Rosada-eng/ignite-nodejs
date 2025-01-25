import { z } from 'zod'

export const envSchema = z.object({
    NODE_ENV: z.enum(['dev', 'prod']).default('dev'),
    DATABASE_URL: z.string(),
})

export const env = envSchema.parse(process.env)
