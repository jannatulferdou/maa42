import prisma from "../../lib/prisma";

const createUser = async (payload: any) => {
  const userData = {
    uid: payload.uid,
    name: payload.name,
    email: payload.email,

    profileImage: payload.profileImage || null,

    dateOfBirth: payload.dateOfBirth || null,
    age:
      payload.age === "" ||
      payload.age === undefined ||
      payload.age === null
        ? null
        : Number(payload.age),

    gender: payload.gender || null,
    bloodGroup: payload.bloodGroup || null,

    // User type / role
    // mother | doctor
    role: payload.role || "mother",

    // Pregnancy / Postpartum
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

    // Doctor information
    doctor: payload.doctor || null,
    clinic: payload.clinic || null,

    emergencyContact:
      payload.emergencyContact || null,

    // Privacy settings
    shareWithDoctor:
      payload.shareWithDoctor ?? true,

    emergencyAccess:
      payload.emergencyAccess ?? true,

    offlineSync:
      payload.offlineSync ?? true,

    chatHistoryEnabled:
      payload.chatHistoryEnabled ?? true,

    analyticsEnabled:
      payload.analyticsEnabled ?? false,
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
    where: {
      uid,
    },
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
        payload.profileImage ?? undefined,

      name:
        payload.name ?? undefined,

      dateOfBirth:
        payload.dateOfBirth ?? undefined,

      age:
        payload.age === "" ||
        payload.age === undefined ||
        payload.age === null
          ? null
          : Number(payload.age),

      gender:
        payload.gender ?? undefined,

      bloodGroup:
        payload.bloodGroup ?? undefined,

      // User role
      role:
        payload.role ?? undefined,

      // Pregnancy / Postpartum
      childbirthDate:
        payload.childbirthDate ?? undefined,

      deliveryType:
        payload.deliveryType ?? undefined,

      postpartumDay:
        payload.postpartumDay === "" ||
        payload.postpartumDay === undefined ||
        payload.postpartumDay === null
          ? null
          : Number(payload.postpartumDay),

      previousComplications:
        payload.previousComplications ?? undefined,

      existingHealthConditions:
        payload.existingHealthConditions ?? undefined,

      currentMedicines:
        payload.currentMedicines ?? undefined,

      doctor:
        payload.doctor ?? undefined,

      clinic:
        payload.clinic ?? undefined,

      emergencyContact:
        payload.emergencyContact ?? undefined,

      // Privacy settings
      shareWithDoctor:
        payload.shareWithDoctor ?? undefined,

      emergencyAccess:
        payload.emergencyAccess ?? undefined,

      offlineSync:
        payload.offlineSync ?? undefined,

      chatHistoryEnabled:
        payload.chatHistoryEnabled ?? undefined,

      analyticsEnabled:
        payload.analyticsEnabled ?? undefined,
    },
  });
};


export const UserService = {
  createUser,
  getUserByUid,
  updateUser,
};