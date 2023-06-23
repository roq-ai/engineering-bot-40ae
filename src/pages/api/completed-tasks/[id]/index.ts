import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { completedTaskValidationSchema } from 'validationSchema/completed-tasks';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.completed_task
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getCompletedTaskById();
    case 'PUT':
      return updateCompletedTaskById();
    case 'DELETE':
      return deleteCompletedTaskById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCompletedTaskById() {
    const data = await prisma.completed_task.findFirst(convertQueryToPrismaUtil(req.query, 'completed_task'));
    return res.status(200).json(data);
  }

  async function updateCompletedTaskById() {
    await completedTaskValidationSchema.validate(req.body);
    const data = await prisma.completed_task.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteCompletedTaskById() {
    const data = await prisma.completed_task.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
