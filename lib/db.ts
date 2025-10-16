// lib/db.ts
import { drizzle } from "drizzle-orm/neon-http";

// Lazy init pour éviter toute connexion pendant le build
let _neon: ReturnType<typeof neon> | null = null;
function getNeon() {
  if (_neon) return _neon;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is missing");
  _neon = neon(url);
  return _neon;
}

// Tag sql compatible (array, transaction)
export const sql: any = ((...args: any[]) => getNeon()(...args)) as any;
sql.array = (...args: any[]) => getNeon().array(...args);
sql.transaction = (...args: any[]) => getNeon().transaction?.(...args);

// Drizzle reçoit la fonction, pas d'appel DB au top-level
export const db = drizzle(sql);
