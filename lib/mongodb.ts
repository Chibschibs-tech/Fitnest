// This is a stub implementation since MongoDB is not used
export const connectMongoDB = async () => {
  console.warn("MongoDB connection was requested but MongoDB is not used in this project")
  return Promise.resolve()
}
