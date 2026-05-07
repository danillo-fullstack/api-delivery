import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { compare } from "bcrypt";
import { z } from "zod";

import { AppError } from "@/utils/AppError";

class SessionsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.string().email().trim(),
      password: z.string().min(6).trim(),
    });

    const { email, password } = bodySchema.parse(request.body);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await compare(password, user.password)))  {
      throw new AppError("Invalid email or password", 401);
    }

    const { password: _, ...userWithoutPassword } = user;

    return response.json({ user: userWithoutPassword });
  }
}

export { SessionsController };
