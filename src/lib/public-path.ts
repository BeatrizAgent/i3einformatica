const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetPath(path: string) {
  return `${basePath}${path}`;
}

export function publicUrl(path: string) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const root = `${origin.replace(/\/+$/, "")}${basePath}/`;
  return new URL(path.replace(/^\/+/, ""), root).toString();
}
