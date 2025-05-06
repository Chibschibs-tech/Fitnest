import prisma from "../app/libs/prismadb"

async function main() {
  try {
    // Test the connection
    await prisma.$connect()
    console.log("Database connection successful!")

    // Get the number of users (just as a test query)
    const userCount = await prisma.user.count()
    console.log(`Number of users in the database: ${userCount}`)
  } catch (error) {
    console.error("Database connection failed:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
