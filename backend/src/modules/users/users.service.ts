import prisma from "../../lib/prisma";

const createUser = async (payload: any) => {
  const userData = {
    uid: payload.uid,
    name: payload.name,
    email: payload.email,

    profileImage: payload.profileImage || null,

    dateOfBirth: payload.dateOfBirth || null,
    age: payload.age || null,
    gender: payload.gender || null,
    bloodGroup: payload.bloodGroup || null,

    childbirthDate: payload.childbirthDate || null,
    deliveryType: payload.deliveryType || null,

    postpartumDay:
      payload.postpartumDay === null ||
      payload.postpartumDay === undefined ||
      payload.postpartumDay === ""
        ? null
        : Number(payload.postpartumDay),

    previousComplications:
      payload.previousComplications || null,

    existingHealthConditions:
      payload.existingHealthConditions || null,

    currentMedicines:
      payload.currentMedicines || null,

    doctor: payload.doctor || null,
    clinic: payload.clinic || null,

    emergencyContact:
      payload.emergencyContact || null,
    shareWithDoctor: payload.shareWithDoctor ?? true,
    emergencyAccess: payload.emergencyAccess ?? true,
    offlineSync: payload.offlineSync ?? true,
    chatHistoryEnabled: payload.chatHistoryEnabled ?? true,
    analyticsEnabled: payload.analyticsEnabled ?? false,
  };

  return prisma.user.upsert({
    where: {
      uid: payload.uid,
    },
    update: userData,
    create: userData,
  });
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

const updateUser = async (
  uid: string,
  payload: any
) => {
  return prisma.user.update({
    where: {
      uid,
    },
    data: {
      profileImage:
        payload.profileImage || null,

      name: payload.name || null,
      dateOfBirth:
        payload.dateOfBirth || null,

      age:
        payload.age === "" ||
        payload.age === undefined
          ? null
          : Number(payload.age),

      gender: payload.gender || null,

      bloodGroup:
        payload.bloodGroup || null,

      childbirthDate:
        payload.childbirthDate || null,

      deliveryType:
        payload.deliveryType || null,

      postpartumDay:
        payload.postpartumDay === "" ||
        payload.postpartumDay === undefined
          ? null
          : Number(payload.postpartumDay),

      previousComplications:
        payload.previousComplications ||
        null,

      existingHealthConditions:
        payload.existingHealthConditions ||
        null,

      currentMedicines:
        payload.currentMedicines ||
        null,

      doctor:
        payload.doctor || null,

      clinic:
        payload.clinic || null,

      emergencyContact:
        payload.emergencyContact || null,

      shareWithDoctor:
        payload.shareWithDoctor,

      emergencyAccess:
        payload.emergencyAccess,

      offlineSync:
        payload.offlineSync,

      chatHistoryEnabled:
        payload.chatHistoryEnabled,

      analyticsEnabled:
        payload.analyticsEnabled,
    },
  });
};

export const UserService = {
  createUser,
  getUserByUid,
  updateUser,
};