import prisma from "../../lib/prisma";

const createUser = async (payload: any) => {
  const userData = {
    uid: payload.uid,
    name: payload.name,
    email: payload.email,
    dateOfBirth: payload.dateOfBirth || null,
    deliveryType: payload.deliveryType || null,
    postpartumDay:
      payload.postpartumDay === null ||
      payload.postpartumDay === undefined ||
      payload.postpartumDay === ""
        ? null
        : Number(payload.postpartumDay),
    emergencyContact: payload.emergencyContact || null,
  };

  console.log("USER DATA FOR PRISMA:", userData);

  const result = await prisma.user.upsert({
    where: {
      uid: payload.uid,
    },
    update: userData,
    create: userData,
  });

  return result;
};

const getUserByUid = async (uid: string) => {
  const user = await prisma.user.findUnique({
    where: { uid },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const UserService = {
  createUser,
  getUserByUid,
};