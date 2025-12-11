export const MEAL_TYPES = [
    {
      id: 'breakfast',
      label: 'Breakfast',
      description: 'Start your day right',
    },
    {
      id: 'lunch',
      label: 'Lunch',
      description: 'Midday fuel',
    },
    {
      id: 'dinner',
      label: 'Dinner',
      description: 'Evening nutrition',
    },
  ] as const
  
  export const SNACK_OPTIONS = [
    { value: 0, label: 'No Snacks', description: 'Just main meals' },
    { value: 1, label: '1 Snack', description: 'One healthy snack' },
    { value: 2, label: '2 Snacks', description: 'Two healthy snacks' },
  ] as const
  
  export const DURATION_OPTIONS = [
    { value: 1, label: '1 Week', description: '7 days', days: 7 },
    { value: 2, label: '2 Weeks', description: '14 days', days: 14 },
    { value: 4, label: '1 Month', description: '28 days', days: 28 },
  ] as const
  