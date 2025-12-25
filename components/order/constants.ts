export const MEAL_TYPES = [
    {
      id: 'breakfast',
      label: 'Petit-déjeuner',
      description: 'Commencez bien votre journée',
    },
    {
      id: 'lunch',
      label: 'Déjeuner',
      description: 'Alimentez votre après-midi',
    },
    {
      id: 'dinner',
      label: 'Dîner',
      description: 'Terminez votre journée sainement',
    },
  ] as const
  
  export const SNACK_OPTIONS = [
    { value: 0, label: 'Pas de Snacks', description: 'Économisez' },
    { value: 1, label: '1 Snack', description: 'Boost parfait en milieu de journée' },
    { value: 2, label: '2 Snacks', description: 'Énergie maximale toute la journée' },
  ] as const
  
  export const DURATION_OPTIONS = [
    { value: 1, label: '1 Semaine', description: 'Essayez', days: 7 },
    { value: 2, label: '2 Semaines', description: 'Le plus flexible', days: 14 },
    { value: 4, label: '4 Semaines', description: 'Meilleur rapport qualité-prix', days: 28 },
  ] as const
  