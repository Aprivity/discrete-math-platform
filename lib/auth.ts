import type { PublicUser, User } from "@/types/user";

export const USERS_STORAGE_KEY = "lisan_users";
export const CURRENT_USER_STORAGE_KEY = "lisan_current_user";

export type AuthResult =
  | {
      ok: true;
      user: PublicUser;
    }
  | {
      ok: false;
      message: string;
    };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
  };
}

function emitAuthChange() {
  window.dispatchEvent(new Event("lisan-auth-change"));
}

export function isValidEmail(email: string) {
  return emailPattern.test(email.trim());
}

export function getUsers(): User[] {
  if (!canUseStorage()) {
    return [];
  }

  const rawUsers = window.localStorage.getItem(USERS_STORAGE_KEY);

  if (!rawUsers) {
    return [];
  }

  try {
    const parsedUsers = JSON.parse(rawUsers);
    return Array.isArray(parsedUsers) ? (parsedUsers as User[]) : [];
  } catch {
    return [];
  }
}

export function saveUser(user: User) {
  const users = getUsers();
  const nextUsers = users.some((candidate) => candidate.id === user.id)
    ? users.map((candidate) => (candidate.id === user.id ? user : candidate))
    : [...users, user];

  saveUsers(nextUsers);
}

function saveUsers(users: User[]) {
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function getCurrentUser(): PublicUser | null {
  if (!canUseStorage()) {
    return null;
  }

  const rawUser = window.localStorage.getItem(CURRENT_USER_STORAGE_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as PublicUser;
  } catch {
    window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    return null;
  }
}

export function isLoggedIn() {
  return Boolean(getCurrentUser());
}

export function registerUser(input: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}): AuthResult {
  if (!canUseStorage()) {
    return { ok: false, message: "当前环境暂不支持本地登录状态。" };
  }

  const username = input.username.trim();
  const email = input.email.trim().toLowerCase();
  const password = input.password;
  const confirmPassword = input.confirmPassword;

  if (!username) {
    return { ok: false, message: "请输入用户名。" };
  }

  if (!email) {
    return { ok: false, message: "请输入邮箱。" };
  }

  if (!isValidEmail(email)) {
    return { ok: false, message: "邮箱格式不正确。" };
  }

  if (!password) {
    return { ok: false, message: "请输入密码。" };
  }

  if (password.length < 6) {
    return { ok: false, message: "密码长度至少 6 位。" };
  }

  if (!confirmPassword) {
    return { ok: false, message: "请再次输入密码。" };
  }

  if (password !== confirmPassword) {
    return { ok: false, message: "两次输入的密码不一致。" };
  }

  const users = getUsers();
  const isEmailTaken = users.some((user) => user.email.toLowerCase() === email);

  if (isEmailTaken) {
    return { ok: false, message: "该邮箱已注册，请直接登录。" };
  }

  const user: User = {
    id: crypto.randomUUID(),
    username,
    email,
    // Mock-only: never store plaintext passwords in production. Replace this
    // with Supabase Auth, NextAuth, Clerk, or a backend password hash flow.
    password,
    createdAt: new Date().toISOString(),
  };

  saveUser(user);

  return { ok: true, user: toPublicUser(user) };
}

export function loginUser(input: { email: string; password: string }): AuthResult {
  if (!canUseStorage()) {
    return { ok: false, message: "当前环境暂不支持本地登录状态。" };
  }

  const email = input.email.trim().toLowerCase();
  const password = input.password;

  if (!email) {
    return { ok: false, message: "请输入邮箱。" };
  }

  if (!isValidEmail(email)) {
    return { ok: false, message: "邮箱格式不正确。" };
  }

  if (!password) {
    return { ok: false, message: "请输入密码。" };
  }

  const user = getUsers().find((candidate) => candidate.email.toLowerCase() === email && candidate.password === password);

  if (!user) {
    return { ok: false, message: "邮箱或密码错误。" };
  }

  const publicUser = toPublicUser(user);
  window.localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(publicUser));
  emitAuthChange();

  return { ok: true, user: publicUser };
}

export function logoutUser() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  emitAuthChange();
}
