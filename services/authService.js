import api from "@/lib/api";

export const sendOtp = (email) =>
  api.post("/auth/send-otp", { email });

export const verifyOtp = (email, otp) =>
  api.post("/auth/verify-otp", { email, otp });

export const registerUser = (data) =>
  api.post("/auth/register", data);

export const loginUser = (data) =>
  api.post("/auth/login", data);