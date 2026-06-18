import api from "@/lib/api";

interface UploadResponse {
  success: boolean;
  data: { url: string };
  error?: string;
}

export const uploadService = {
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post<UploadResponse>("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};
