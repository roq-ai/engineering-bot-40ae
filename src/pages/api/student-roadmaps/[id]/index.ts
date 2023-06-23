import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { studentRoadmapValidationSchema } from 'validationSchema/student-roadmaps';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.student_roadmap
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getStudentRoadmapById();
    case 'PUT':
      return updateStudentRoadmapById();
    case 'DELETE':
      return deleteStudentRoadmapById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getStudentRoadmapById() {
    const data = await prisma.student_roadmap.findFirst(convertQueryToPrismaUtil(req.query, 'student_roadmap'));
    return res.status(200).json(data);
  }

  async function updateStudentRoadmapById() {
    await studentRoadmapValidationSchema.validate(req.body);
    const data = await prisma.student_roadmap.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteStudentRoadmapById() {
    const data = await prisma.student_roadmap.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
