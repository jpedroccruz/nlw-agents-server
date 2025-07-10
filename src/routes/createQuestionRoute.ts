import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod/v4'
import { db } from '../db/connection.ts'
import { schema } from '../db/schema/index.ts'

export const createQuestionRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms/:roomId/questions',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
        body: z.object({
          question: z.string().min(4, {
            message: 'Question must have at least 4 characteres',
          }),
        }),
      },
    },
    async (request, reply) => {
      const { question } = request.body
      const { roomId } = request.params

      const result = await db
        .insert(schema.questions)
        .values({ question, roomId })
        .returning()

      const insertedQuestion = result[0]

      if (!insertedQuestion) {
        throw new Error('Failed to create new question.')
      }

      return reply.send({ roomId: insertedQuestion.id })
    }
  )
}
