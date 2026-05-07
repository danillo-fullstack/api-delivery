import { Request, Response } from "express";
import { hash } from "bcrypt";
import { z } from "zod";

import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";

class UserController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(2),
      email: z.string().trim().email(),
      password: z.string().min(6),
    });

    const { name, email, password } = bodySchema.parse(request.body);

    const userWithSameEmail = await prisma.user.findUnique({ where: { email } });

    if (userWithSameEmail) {
      throw new AppError("User with same email already exists.");
    }

    const hashedPassword = await hash(password, 8);

    const createdUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true
      }

    });

    return response.status(201).json(createdUser);
  }
}

export { UserController };
