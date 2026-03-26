import type { CreateHospitalInput, UpdateHospitalInput } from "../schemas/hospital.schema";
import type { LoginInput } from "../schemas/auth.schema";
import type { HospitalType, Specialization } from "../constants";

export type { CreateHospitalInput, UpdateHospitalInput, LoginInput };
export type { HospitalType, Specialization };

export interface Hospital {
  id: string;
  name: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  country: string;
  postalCode?: string | null;
  phone: string;
  emergencyPhone?: string | null;
  latitude: number;
  longitude: number;
  googleMapsLink: string;
  type: HospitalType;
  specializations: string[];
  available24x7: boolean;
  isActive: boolean;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  distance?: number;
}

export interface HospitalWithDistance extends Hospital {
  distance: number;
}

export interface Admin {
  id: string;
  email: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
