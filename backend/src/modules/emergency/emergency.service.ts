
import prisma from "../../lib/prisma";

const createContact = async (payload: any) => {
  const user = await prisma.user.findUnique({
    where: {
      uid: payload.uid,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return prisma.emergencyContact.create({
    data: {
      userId: user.id,
      name: payload.name,
      relation: payload.relation,
      phone: payload.phone,
    },
  });
};

const getContacts = async (uid: string) => {
  const user = await prisma.user.findUnique({
    where: { uid },
  });

  if (!user) return [];

  return prisma.emergencyContact.findMany({
    where: {
      userId: user.id,
    },
    orderBy: [
      { isFavorite: "desc" },
      { createdAt: "desc" },
    ],
  });
};

const updateContact = async (
  id: number,
  payload: any
) => {
  return prisma.emergencyContact.update({
    where: { id },
    data: {
      name: payload.name,
      relation: payload.relation,
      phone: payload.phone,
    },
  });
};

const deleteContact = async (id: number) => {
  return prisma.emergencyContact.delete({
    where: { id },
  });
};

const toggleFavorite = async (id: number) => {
  const contact =
    await prisma.emergencyContact.findUnique({
      where: { id },
    });

  if (!contact) {
    throw new Error("Contact not found");
  }

  return prisma.emergencyContact.update({
    where: { id },
    data: {
      isFavorite: !contact.isFavorite,
    },
  });
};

export const EmergencyServices = {
  createContact,
  getContacts,
  updateContact,
  deleteContact,
  toggleFavorite,
};

