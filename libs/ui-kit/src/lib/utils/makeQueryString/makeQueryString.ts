export function makeQueryString(queryObj: { [s: string]: unknown; } | ArrayLike<unknown>) {
  const path = [];
  for (const [key, value] of Object.entries(queryObj)) {
    path.push(`${key}=${value}`);
  }
  return path.join('&').toString();
}
