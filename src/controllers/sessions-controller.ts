import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { z } from "zod";

import { authConfig } from "@/configs/auth";
import { AppError } from "@/utils/AppError";

class SessionsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.string().email().trim(),
      password: z.string().min(6).trim(),
    });

    const { email, password } = bodySchema.parse(request.body);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await compare(password, user.password))) {
      throw new AppError("Invalid email or password", 401);
    }

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({ role: user.role ?? "customer" }, secret, {
      subject: user.id,
      expiresIn,
    });

    const { password: _, ...userWithoutPassword } = user;

    return response.json({ token, user: userWithoutPassword });
  }
}

export { SessionsController };
