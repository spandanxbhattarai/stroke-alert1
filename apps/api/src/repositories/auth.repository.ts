import { prisma } from "../lib/prisma";

export const authRepository = {
  async findByEmail(email: string) {
    return prisma.admin.findUnique({ where: { email } });
  },

  async findById(id: string) {
    return prisma.admin.findUnique({ where: { id } });
  },
};
