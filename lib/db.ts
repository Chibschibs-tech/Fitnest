export const db = {
  query: async (sql: string, params: any[] = []) => {
    console.log("DB Query:", sql, params)
    return []
  },
}

export const users = {
  findByEmail: async (email: string) => null,
  create: async (user: any) => ({ id: 1, ...user }),
}

export const mealPreferences = {
  findByUserId: async (userId: number) => null,
  create: async (preferences: any) => ({ id: 1, ...preferences }),
}

export const orders = {
  findByUserId: async (userId: number) => [],
  create: async (order: any) => ({ id: 1, ...order }),
}

export const mealPlans = {
  findAll: async () => [],
  findById: async (id: number) => null,
}

export const meals = {
  findAll: async () => [],
  findById: async (id: number) => null,
}

export const notificationPreferences = {
  findByUserId: async (userId: number) => null,
  create: async (preferences: any) => ({ id: 1, ...preferences }),
}

export const products = {
  findAll: async () => [],
  findById: async (id: number) => null,
}
