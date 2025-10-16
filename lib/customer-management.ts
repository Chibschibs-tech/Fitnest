cat > lib/customer-management.ts << 'EOF'
import { sql } from "@/lib/db";

export async function ensureCustomerIndexes() {
  await sql`
    CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
    CREATE INDEX IF NOT EXISTS idx_customers_city   ON customers(city);
  `;
}
EOF
