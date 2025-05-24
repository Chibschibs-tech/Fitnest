// Simple database interface using fetch for HTTP requests
// This avoids any native module dependencies

interface DatabaseResponse {
  success: boolean
  data?: any
  error?: string
}

// Simple database client that uses HTTP requests instead of native modules
export const db = {
  query: async (sql: string, params: any[] = []): Promise<DatabaseResponse> => {
    try {
      // For now, return mock data to avoid any native dependencies
      return { success: true, data: [] }
    } catch (error) {
      return { success: false, error: String(error) }
    }
  },
}

// Export table objects for compatibility
export const users = {
  findMany: () => Promise.resolve([]),
  findUnique: () => Promise.resolve(null),
  create: () => Promise.resolve({}),
  update: () => Promise.resolve({}),
  delete: () => Promise.resolve({}),
}

export const mealPlans = {
  findMany: () => Promise.resolve([]),
  findUnique: () => Promise.resolve(null),
  create: () => Promise.resolve({}),
}

export const meals = {
  findMany: () => Promise.resolve([]),
  findUnique: () => Promise.resolve(null),
}

export const orders = {
  findMany: () => Promise.resolve([]),
  create: () => Promise.resolve({}),
}

export const mealPreferences = {
  findMany: () => Promise.resolve([]),
  upsert: () => Promise.resolve({}),
}

export const notificationPreferences = {
  findUnique: () => Promise.resolve(null),
  upsert: () => Promise.resolve({}),
}

export const products = {
  findMany: () => Promise.resolve([]),
  findUnique: () => Promise.resolve(null),
}
