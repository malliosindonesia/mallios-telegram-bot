export function formatUserName(
  firstName?: string,
  username?: string,
): string {
  if (firstName?.trim()) {
    return firstName.trim();
  }

  if (username?.trim()) {
    return `@${username.trim()}`;
  }

  return "teman";
}
