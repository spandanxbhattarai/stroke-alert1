import bcrypt from "bcryptjs";
import { authRepository } from "../repositories/auth.repository";
import { signToken } from "../lib/jwt";

export const authService = {
  async login(email: string, password: string) {
    const admin = await authRepository.findByEmail(email);
    if (!admin) throw new Error("Invalid credentials");

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) throw new Error("Invalid credentials");

    const token = signToken({ id: admin.id, email: admin.email });
    return { token, admin: { id: admin.id, email: admin.email } };
  },

  async getMe(id: string) {
    const admin = await authRepository.findById(id);
    if (!admin) throw new Error("Admin not found");
    return { id: admin.id, email: admin.email, createdAt: admin.createdAt };
  },
};
