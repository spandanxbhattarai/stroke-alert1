import { prisma } from "../lib/prisma";
import type { CreateHospitalInput, UpdateHospitalInput } from "@strokealert/shared";

export const hospitalRepository = {
  async findAll(options?: { isActive?: boolean; city?: string; search?: string; page?: number; pageSize?: number }) {
    const { isActive, city, search, page = 1, pageSize = 20 } = options || {};
    const where: any = {};
    if (isActive !== undefined) where.isActive = isActive;
    if (city) where.city = { contains: city, mode: "insensitive" };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { addressLine1: { contains: search, mode: "insensitive" } },
      ];
    }
    const [hospitals, total] = await Promise.all([
      prisma.hospital.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.hospital.count({ where }),
    ]);
    return { hospitals, total };
  },

  async findAllActive() {
    return prisma.hospital.findMany({ where: { isActive: true } });
  },

  async findById(id: string) {
    return prisma.hospital.findUnique({ where: { id } });
  },

  async create(data: CreateHospitalInput) {
    return prisma.hospital.create({ data });
  },

  async update(id: string, data: UpdateHospitalInput) {
    return prisma.hospital.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.hospital.delete({ where: { id } });
  },

  async toggleStatus(id: string, isActive: boolean) {
    return prisma.hospital.update({ where: { id }, data: { isActive } });
  },

  async getStats() {
    const [total, active, cities] = await Promise.all([
      prisma.hospital.count(),
      prisma.hospital.count({ where: { isActive: true } }),
      prisma.hospital.findMany({ select: { city: true }, distinct: ["city"] }),
    ]);
    return { total, active, citiesCount: cities.length };
  },
};
