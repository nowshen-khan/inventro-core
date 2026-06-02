import { comparePassword } from "@/core/lib/password";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@/core/auth/jwt";
import { authRepository } from "./repository";
import { AppError } from "@/core/errors/AppError";
import { LoginInput } from "./schema";

export class AuthService {
  async login(data: LoginInput) {
    const email = data.email;
    const password = data.password;
    const user = await authRepository.findUserByEmail(email);

    if (!user || !user.password) {
      throw new AppError("Invalid credentials", 401);
    }

    const valid = await comparePassword(password, user.password);

    if (!valid) {
      throw new AppError("Invalid credentials", 401);
    }

    const accessToken = signAccessToken({
      userId: user.id,
      role: user.role.name,
      branchId: user.branchId ?? undefined,
    });

    const refreshToken = signRefreshToken({ userId: user.id });
    await authRepository.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
    };
  }

  async refresh(token: string) {
    try {
      const decoded = verifyRefreshToken(token);
      const user = await authRepository.findUserById(decoded.userId);
      if (!user || user.refreshToken !== token)
        throw new AppError("Invalid refresh token", 401);
      const newAccess = signAccessToken({
        userId: user.id,
        role: user.role.name,
        branchId: user.branchId ?? undefined,
      });
      const newRefresh = signRefreshToken({ userId: user.id });
      await authRepository.updateRefreshToken(user.id, newRefresh);
      return { accessToken: newAccess, refreshToken: newRefresh };
    } catch {
      throw new AppError("Invalid refresh token", 401);
    }
  }

  async getMe(userId: string) {
    const user = await authRepository.findUserById(userId);
    if (!user) throw new AppError("User not found", 404);
    // const { password, refreshToken, ...rest } = user;
    return {
      id: user.id,

      name: user.name,

      email: user.email,

      role: typeof user.role === "string" ? user.role : user.role?.name || "",

      branchId: user.branchId,
    };
  }

  async logout(userId: string) {
    await authRepository.updateRefreshToken(userId, null);
  }
}
