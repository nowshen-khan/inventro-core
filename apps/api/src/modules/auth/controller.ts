import { FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "./service";
import { prisma } from "@/core/database/prisma";
import { loginSchema } from "./schema";

const service = new AuthService();

export class AuthController {
  async permissions(req: FastifyRequest, reply: FastifyReply) {
    const role = await prisma.role.findUniqueOrThrow({
      where: { name: req.user.role as any },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    const permissions = role.permissions.map((p) => p.permission.action);

    reply.send(permissions);
  }

  async login(req: FastifyRequest, reply: FastifyReply) {
    const body = loginSchema.parse(req.body);
    const result = await service.login(body);

    reply
      .setCookie("accessToken", result.accessToken, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      })
      .setCookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      })
      .send({ user: result.user });
  }

  async refresh(req: FastifyRequest, reply: FastifyReply) {
    const oldRefreshToken = req.cookies?.refreshToken;

    if (!oldRefreshToken) {
      return reply.status(401).send({ message: "Missing refresh token" });
    }

    const tokens = await service.refresh(oldRefreshToken);

    reply
      .setCookie("accessToken", tokens.accessToken, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      })
      .setCookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      })
      .send({ message: "Token refreshed" });
  }

  async me(req: FastifyRequest, reply: FastifyReply) {
    // console.log("REQ USER:", req.user);
    const user = await service.getMe(req.user.userId);
    return reply.send({ user });
  }

  async logout(req: FastifyRequest, reply: FastifyReply) {
    await service.logout(req.user.userId);
    reply
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .send({ message: "Logged out" });
  }
}
