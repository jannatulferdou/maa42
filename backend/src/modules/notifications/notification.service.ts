import prisma from "../../lib/prisma";

const createNotification = async (payload: {
  userId: number;
  title: string;
  subtitle: string;
  type?: string;
}) => {
  return await prisma.notification.create({
    data: payload,
  });
};

const getUserNotifications = async (userId: number) => {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateNotification = async (
  id: number,
  payload: {
    title?: string;
    subtitle?: string;
    type?: string;
    isRead?: boolean;
  }
) => {
  return await prisma.notification.update({
    where: { id },
    data: payload,
  });
};

const deleteNotification = async (id: number) => {
  return await prisma.notification.delete({
    where: { id },
  });
};

export const NotificationService = {
  createNotification,
  getUserNotifications,
  updateNotification,
  deleteNotification,
};