export const HOSPITAL_TYPES = {
  GOVERNMENT: "GOVERNMENT",
  PRIVATE: "PRIVATE",
  NGO: "NGO",
} as const;

export const SPECIALIZATIONS = [
  "Neurology",
  "Stroke Unit",
  "ICU",
  "Emergency Medicine",
  "Cardiology",
  "Radiology",
  "Neurosurgery",
] as const;

export type HospitalType = keyof typeof HOSPITAL_TYPES;
export type Specialization = (typeof SPECIALIZATIONS)[number];

export const NEPAL_EMERGENCY_NUMBER = "102";
export const DEFAULT_HOSPITAL_LIMIT = 5;
