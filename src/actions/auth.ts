"use server";

import { redirect } from "next/navigation";
import { getAdminUser, updateAdminUser } from "@/lib/db";
import {
  verifyPassword,
  hashPassword,
  createToken,
  setAuthCookie,
  removeAuthCookie,
  getAuthFromCookie,
} from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const user = await getAdminUser(email);
  if (!user) {
    return { error: "Invalid email or password" };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { error: "Invalid email or password" };
  }

  const token = await createToken({
    email: user.email,
    name: user.name,
    role: user.role,
  });

  await setAuthCookie(token);
  redirect("/admin");
}

export async function logoutAction() {
  await removeAuthCookie();
  redirect("/admin/login");
}

export async function changePasswordAction(formData: FormData) {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!currentPassword || !newPassword) {
    return { error: "Both fields are required" };
  }

  if (newPassword.length < 6) {
    return { error: "New password must be at least 6 characters" };
  }

  const auth = await getAuthFromCookie();
  if (!auth) {
    return { error: "Not authenticated" };
  }

  const user = await getAdminUser(auth.email);
  if (!user) {
    return { error: "User not found" };
  }

  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) {
    return { error: "Current password is incorrect" };
  }

  const newHash = await hashPassword(newPassword);
  await updateAdminUser(auth.email, { passwordHash: newHash });

  return { success: true };
}

export async function getCurrentUser() {
  return getAuthFromCookie();
}
