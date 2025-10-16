cat > app/api/cart-debug/route.ts << 'EOF'
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const existsRes = await sql<[{ exists: boolean }]>`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables WHERE table_name = 'cart_items'
    ) AS exists;
  `;
  const exists = existsRes[0]?.exists ?? false;

  let structure: Array<{ column_name: string; data_type: string; column_default: string | null }> = [];
  if (exists) {
    structure = await sql`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'cart_items'
      ORDER BY ordinal_position;
    `;
  }

  return NextResponse.json({ exists, structure });
}
EOF
