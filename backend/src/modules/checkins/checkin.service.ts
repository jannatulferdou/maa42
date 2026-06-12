import prisma from "../../lib/prisma";

const dangerSymptoms = [
  "Heavy bleeding",
  "Fever",
  "Severe headache",
  "Swelling",
  "Infection signs",
  "Trouble feeding",
  "Pain",
];

function analyzeRisk(symptoms: string[], severity: string) {
  const hasDanger = symptoms.some((s) => dangerSymptoms.includes(s));

  if (severity === "Severe" || symptoms.includes("Heavy bleeding")) {
    return {
      risk: "High Risk",
      reason:
        "Some symptoms may indicate a serious postpartum danger sign. Please seek urgent medical help.",
      nextSteps: ["Call emergency contact", "Visit hospital/clinic immediately", "Talk to doctor"],
    };
  }

  if (severity === "Moderate" || hasDanger) {
    return {
      risk: "Moderate Risk",
      reason:
        "Some symptoms need attention. Please monitor closely and contact a doctor or health worker.",
      nextSteps: ["Contact my doctor", "Monitor symptoms", "Visit clinic if it gets worse"],
    };
  }

  return {
    risk: "Low Risk",
    reason: "You seem stable right now. Continue monitoring your recovery.",
    nextSteps: ["Monitor at home", "Drink water and rest", "Check in again tomorrow"],
  };
}

export const CheckinService = {
  createCheckin: async (payload: {
    userId: number;
    symptoms: string[];
    severity: string;
    notes?: string;
  }) => {
    const result = analyzeRisk(payload.symptoms, payload.severity);

    const checkin = await prisma.healthCheckin.create({
      data: {
        userId: payload.userId,
        symptoms: payload.symptoms,
        severity: payload.severity,
        notes: payload.notes ?? null,
        risk: result.risk,
        reason: result.reason,
        nextSteps: result.nextSteps,
      },
    });

    return checkin;
  },

  getUserCheckins: async (userId: number) => {
    return prisma.healthCheckin.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },
};