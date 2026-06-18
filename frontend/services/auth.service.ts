import api from "@/lib/api";
import { User } from "@/types";

interface AuthResponse {
  success: boolean;
  data: { user: User; token: string };
  message?: string;
  error?: string;
}

interface MeResponse {
  success: boolean;
  data: User;
  error?: string;
}

export const authService = {
  async register(data: {
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
    city?: string;
    password: string;
  }) {
    console.log("Submitting:", { ...data, password: "[REDACTED]" });
    const res = await api.post<AuthResponse>("/auth/register", data);
    return res.data;
  },

  async login(email: string, password: string) {
    console.log("Submitting:", { email, password: "[REDACTED]" });
    const res = await api.post<AuthResponse>("/auth/login", { email, password });
    return res.data;
  },

  async getMe() {
    const res = await api.get<MeResponse>("/auth/me");
    return res.data;
  },

  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    city?: string;
  }) {
    console.log("Submitting:", data);
    const res = await api.put<MeResponse>("/auth/profile", data);
    return res.data;
  },
};
