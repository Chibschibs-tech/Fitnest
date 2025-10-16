import { NextResponse } from "next/server"
import { sql, db } from "@/lib/db"
import { initCustomersTable, createCustomerProfile } from "@/lib/customer-management"


export async function POST() {
  try {
    // Initialize customers table
    await initCustomersTable()

    // Migrate existing users to customers table
    const existingUsers = await sql`
      SELECT id, created_at, email 
      FROM users 
      WHERE role != 'admin' 
      AND id NOT IN (SELECT user_id FROM customers WHERE user_id IS NOT NULL)
    `

    console.log(`Found ${existingUsers.length} users to migrate to customers`)

    for (const user of existingUsers) {
      await createCustomerProfile(user.id, {
        acquisition_source: "existing_user",
      })
    }

    return NextResponse.json({
      success: true,
      message: `Customer system initialized. Migrated ${existingUsers.length} existing users.`,
    })
  } catch (error) {
    console.error("Error initializing customer system:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to initialize customer system",
      },
      { status: 500 },
    )
  }
}
