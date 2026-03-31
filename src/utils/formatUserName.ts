import type { User } from "grammy/types";

export function formatUserName(user?: User): string {
  if (!user) return "Teman";
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  if (user.first_name) return user.first_name;
  if (user.username) return `@${user.username}`;
  return "Teman";
}