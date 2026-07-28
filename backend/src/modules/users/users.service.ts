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

    role: payload.role || "mother",

    careStage: payload.careStage || null,

    maternalStatus: payload.maternalStatus || null,

    expectedDeliveryDate:
      payload.expectedDeliveryDate || null,

    pregnancyWeek:
      payload.pregnancyWeek === "" ||
      payload.pregnancyWeek === undefined ||
      payload.pregnancyWeek === null
        ? null
        : Number(payload.pregnancyWeek),

    childbirthDate:
      payload.childbirthDate || null,

    deliveryType:
      payload.deliveryType || null,

    postpartumDay:
      payload.postpartumDay === "" ||
      payload.postpartumDay === undefined ||
      payload.postpartumDay === null
        ? null
        : Number(payload.postpartumDay),

    previousComplications:
      payload.previousComplications || null,

    existingHealthConditions:
      payload.existingHealthConditions || null,

    currentMedicines:
      payload.currentMedicines || null,

    specialization:
      payload.specialization || null,

    medicalRegistration:
      payload.medicalRegistration || null,

    hospitalClinic:
      payload.hospitalClinic || null,

    experienceYears:
      payload.experienceYears === "" ||
      payload.experienceYears === undefined ||
      payload.experienceYears === null
        ? null
        : Number(payload.experienceYears),

    doctor:
      payload.doctor || null,

    clinic:
      payload.clinic || null,

    emergencyContact:
      payload.emergencyContact || null,


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

      role:
        payload.role ?? undefined,

      careStage:
        payload.careStage ?? undefined,

      maternalStatus:
        payload.maternalStatus ?? undefined,

      expectedDeliveryDate:
        payload.expectedDeliveryDate ?? undefined,

      pregnancyWeek:
        payload.pregnancyWeek === "" ||
        payload.pregnancyWeek === undefined ||
        payload.pregnancyWeek === null
          ? null
          : Number(payload.pregnancyWeek),

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

      specialization:
        payload.specialization ?? undefined,

      medicalRegistration:
        payload.medicalRegistration ?? undefined,

      hospitalClinic:
        payload.hospitalClinic ?? undefined,

      experienceYears:
        payload.experienceYears === "" ||
        payload.experienceYears === undefined ||
        payload.experienceYears === null
          ? null
          : Number(payload.experienceYears),

      doctor:
        payload.doctor ?? undefined,

      clinic:
        payload.clinic ?? undefined,

      emergencyContact:
        payload.emergencyContact ?? undefined,

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