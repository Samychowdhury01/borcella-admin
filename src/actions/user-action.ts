"use server"

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

interface Payload {
  email: string;
  password: string;
  name: string;
}

export const createUser = async (payload: Payload) => {
  const { email, name, password } = payload;
  const hashedPassword = await bcrypt.hash(
    password,
    Number(process.env.SALT_ROUND)
  );
  const newData = {
    email,
    name,
    password: hashedPassword,
  };

  const newSignUpUser = await prisma.signUp.create({
    data: newData,
  });

  if (!newSignUpUser.id) {
    return null;
  }
  return newSignUpUser;
};

export const getUser = async (email: string) => {
  const user = await prisma.signUp.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return null;
  }
  return user;
};
