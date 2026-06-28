import prisma from "../../lib/prisma";

const createContact = async (payload: any) => {
  return prisma.emergencyContact.create({
    data: payload,
  });
};

const getContacts = async (userId: number) => {
  return prisma.emergencyContact.findMany({
    where: { userId },
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
    data: payload,
  });
};

const deleteContact = async (id: number) => {
  return prisma.emergencyContact.delete({
    where: { id },
  });
};

export const EmergencyServices = {
  createContact,
  getContacts,
  updateContact,
  deleteContact,
};