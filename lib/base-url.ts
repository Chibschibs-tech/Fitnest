// lib/base-url.ts
export function getBaseUrl() {
  // Priorité aux variables explicites
  const explicit =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    process.env.APP_URL;
  if (explicit) return explicit;

  // Vercel fournit VERCEL_URL (sans protocole)
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  // Fallback dev
  return "http://localhost:3000";
}
