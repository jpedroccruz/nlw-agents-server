/*
  VALIDATE AND PARSE ENV VARIABLES
*/

import { z } from 'zod/v4'

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DB_URL: z.url().startsWith('postgresql://'),
})

export const env = envSchema.parse(process.env)
