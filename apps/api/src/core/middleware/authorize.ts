import { prisma } from "@/core/database/prisma";
import { FastifyRequest, FastifyReply } from "fastify";

export const authorize = (...permissions: string[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user;

    // SUPER ADMIN BYPASS
    if (user.role === "SUPER_ADMIN") {
      return;
    }

    const role = await prisma.role.findUnique({
      where: { name: user.role as any },
      include: { permissions: true },
    });
    const hasPermission = permissions.some((p) =>
      role?.permissions.some((rp) => rp.action === p),
    );
    if (!hasPermission) {
      return reply.status(403).send({
        message: "Insufficient permissions",
      });
      //throw request.server.httpErrors.forbidden("Insufficient permissions");
      //  throw reply.forbidden('Insufficient permissions');
    }
  };
};
