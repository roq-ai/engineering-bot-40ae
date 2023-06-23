import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { roadmapValidationSchema } from 'validationSchema/roadmaps';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getRoadmaps();
    case 'POST':
      return createRoadmap();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getRoadmaps() {
    const data = await prisma.roadmap
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'roadmap'));
    return res.status(200).json(data);
  }

  async function createRoadmap() {
    await roadmapValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.student_roadmap?.length > 0) {
      const create_student_roadmap = body.student_roadmap;
      body.student_roadmap = {
        create: create_student_roadmap,
      };
    } else {
      delete body.student_roadmap;
    }
    if (body?.task?.length > 0) {
      const create_task = body.task;
      body.task = {
        create: create_task,
      };
    } else {
      delete body.task;
    }
    const data = await prisma.roadmap.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
