import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getUsers = async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
};
export const createUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "User creation failed" });
  }
};
