/**
 * Validation Constants
 * Validation rules and error messages
 */

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const

export const ERROR_MESSAGES = {
  // Email errors
  EMAIL_REQUIRED: "L'email est requis",
  EMAIL_INVALID: "Adresse email invalide",
  EMAIL_EXISTS: "Cet email est déjà utilisé",

  // Password errors
  PASSWORD_REQUIRED: "Le mot de passe est requis",
  PASSWORD_MIN_LENGTH: `Le mot de passe doit contenir au moins ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} caractères`,
  PASSWORD_MISMATCH: "Les mots de passe ne correspondent pas",
  PASSWORD_CONFIRM_REQUIRED: "Veuillez confirmer votre mot de passe",
  PASSWORD_INCORRECT: "Email ou mot de passe incorrect",

  // Name errors
  NAME_REQUIRED: "Le nom est requis",
  NAME_MIN_LENGTH: `Le nom doit contenir au moins ${VALIDATION_RULES.NAME_MIN_LENGTH} caractères`,

  // Terms errors
  TERMS_REQUIRED: "Vous devez accepter les conditions d'utilisation",

  // Generic errors
  NETWORK_ERROR: "Impossible de se connecter. Vérifiez votre connexion internet.",
  GENERIC_ERROR: "Une erreur est survenue. Veuillez réessayer.",
  SIGNUP_ERROR: "Impossible de créer le compte. Vérifiez votre connexion internet.",
} as const

export const PASSWORD_STRENGTH = {
  WEAK: { min: 0, max: 7, label: 'Faible', color: 'bg-red-500' },
  MEDIUM: { min: 8, max: 11, label: 'Moyen', color: 'bg-yellow-500' },
  STRONG: { min: 12, max: Infinity, label: 'Fort', color: 'bg-green-500' },
} as const
