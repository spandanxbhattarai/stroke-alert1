import { hospitalRepository } from "../repositories/hospital.repository";
import type { CreateHospitalInput, UpdateHospitalInput } from "@strokealert/shared";

// Haversine formula — calculates distance between two lat/lng points in kilometers
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export const hospitalService = {
  async getAll(options?: { city?: string; search?: string; page?: number; pageSize?: number }) {
    return hospitalRepository.findAll(options);
  },

  async getNearest(lat: number, lng: number, limit: number = 5) {
    const hospitals = await hospitalRepository.findAllActive();
    return hospitals
      .map((h) => ({
        ...h,
        distance: haversineDistance(lat, lng, h.latitude, h.longitude),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
  },

  async getById(id: string) {
    const hospital = await hospitalRepository.findById(id);
    if (!hospital) throw new Error("Hospital not found");
    return hospital;
  },

  async create(data: CreateHospitalInput) {
    return hospitalRepository.create(data);
  },

  async update(id: string, data: UpdateHospitalInput) {
    await this.getById(id); // throws if not found
    return hospitalRepository.update(id, data);
  },

  async delete(id: string) {
    await this.getById(id);
    return hospitalRepository.delete(id);
  },

  async toggleStatus(id: string, isActive: boolean) {
    await this.getById(id);
    return hospitalRepository.toggleStatus(id, isActive);
  },

  async getStats() {
    return hospitalRepository.getStats();
  },
};
