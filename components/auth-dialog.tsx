"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Lock, Mail, User, Loader2 } from "lucide-react"

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: "login" | "signup"
  onAuthSuccess?: (user: { name: string; email: string }) => void
}

export function AuthDialog({ open, onOpenChange, defaultTab = "login", onAuthSuccess }: AuthDialogProps) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">(defaultTab)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Form states
  const [loginForm, setLoginForm] = useState({ email: "", password: "", remember: false })
  const [signupForm, setSignupForm] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "",
    terms: false 
  })

  // Validation errors
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({})
  const [signupErrors, setSignupErrors] = useState<{ 
    name?: string; 
    email?: string; 
    password?: string; 
    confirmPassword?: string;
    terms?: string;
  }>({})

  // Email validation
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  // Password strength validation
  const validatePassword = (password: string) => {
    return password.length >= 8
  }

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors: { email?: string; password?: string } = {}

    // Validation
    if (!loginForm.email) {
      errors.email = "L'email est requis"
    } else if (!validateEmail(loginForm.email)) {
      errors.email = "Adresse email invalide"
    }

    if (!loginForm.password) {
      errors.password = "Le mot de passe est requis"
    }

    setLoginErrors(errors)

    if (Object.keys(errors).length === 0) {
      setIsLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setIsLoading(false)
      
      // Mock successful login
      onAuthSuccess?.({ 
        name: loginForm.email.split('@')[0], 
        email: loginForm.email 
      })
      
      // Reset form and close dialog
      setLoginForm({ email: "", password: "", remember: false })
      setLoginErrors({})
      onOpenChange(false)
    }
  }

  // Handle signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors: { 
      name?: string; 
      email?: string; 
      password?: string; 
      confirmPassword?: string;
      terms?: string;
    } = {}

    // Validation
    if (!signupForm.name) {
      errors.name = "Le nom est requis"
    } else if (signupForm.name.length < 2) {
      errors.name = "Le nom doit contenir au moins 2 caractères"
    }

    if (!signupForm.email) {
      errors.email = "L'email est requis"
    } else if (!validateEmail(signupForm.email)) {
      errors.email = "Adresse email invalide"
    }

    if (!signupForm.password) {
      errors.password = "Le mot de passe est requis"
    } else if (!validatePassword(signupForm.password)) {
      errors.password = "Le mot de passe doit contenir au moins 8 caractères"
    }

    if (!signupForm.confirmPassword) {
      errors.confirmPassword = "Veuillez confirmer votre mot de passe"
    } else if (signupForm.password !== signupForm.confirmPassword) {
      errors.confirmPassword = "Les mots de passe ne correspondent pas"
    }

    if (!signupForm.terms) {
      errors.terms = "Vous devez accepter les conditions d'utilisation"
    }

    setSignupErrors(errors)

    if (Object.keys(errors).length === 0) {
      setIsLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setIsLoading(false)
      
      // Mock successful signup
      onAuthSuccess?.({ 
        name: signupForm.name, 
        email: signupForm.email 
      })
      
      // Reset form and close dialog
      setSignupForm({ name: "", email: "", password: "", confirmPassword: "", terms: false })
      setSignupErrors({})
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-fitnest-green/10 via-white to-fitnest-orange/10 p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">
              Bienvenue chez Fitnest
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Connectez-vous pour accéder à votre compte et profiter de tous nos services
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "signup")} className="mt-6">
            <TabsList className="grid w-full grid-cols-2 bg-white/50">
              <TabsTrigger 
                value="login"
                className="data-[state=active]:bg-white data-[state=active]:text-fitnest-green data-[state=active]:shadow-sm"
              >
                Connexion
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="data-[state=active]:bg-white data-[state=active]:text-fitnest-green data-[state=active]:shadow-sm"
              >
                Inscription
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login" className="mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-gray-700 font-medium">
                    Adresse email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="vous@exemple.com"
                      className={`pl-10 ${loginErrors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      value={loginForm.email}
                      onChange={(e) => {
                        setLoginForm({ ...loginForm, email: e.target.value })
                        setLoginErrors({ ...loginErrors, email: undefined })
                      }}
                      disabled={isLoading}
                    />
                  </div>
                  {loginErrors.email && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      {loginErrors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-gray-700 font-medium">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`pl-10 pr-10 ${loginErrors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      value={loginForm.password}
                      onChange={(e) => {
                        setLoginForm({ ...loginForm, password: e.target.value })
                        setLoginErrors({ ...loginErrors, password: undefined })
                      }}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {loginErrors.password && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      {loginErrors.password}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={loginForm.remember}
                      onCheckedChange={(checked) => 
                        setLoginForm({ ...loginForm, remember: checked as boolean })
                      }
                      disabled={isLoading}
                    />
                    <Label 
                      htmlFor="remember" 
                      className="text-sm text-gray-600 font-normal cursor-pointer"
                    >
                      Se souvenir de moi
                    </Label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-fitnest-green hover:text-fitnest-green/80 font-medium transition-colors"
                    onClick={() => {
                      // Handle forgot password
                      console.log("Forgot password clicked")
                    }}
                  >
                    Mot de passe oublié ?
                  </button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-fitnest-green to-emerald-600 hover:from-emerald-600 hover:to-fitnest-green text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connexion en cours...
                    </>
                  ) : (
                    "Se connecter"
                  )}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Ou continuer avec</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full hover:bg-gray-50"
                    disabled={isLoading}
                    onClick={() => console.log("Google login")}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full hover:bg-gray-50"
                    disabled={isLoading}
                    onClick={() => console.log("Facebook login")}
                  >
                    <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </Button>
                </div>
              </form>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup" className="mt-6">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-gray-700 font-medium">
                    Nom complet
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      className={`pl-10 ${signupErrors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      value={signupForm.name}
                      onChange={(e) => {
                        setSignupForm({ ...signupForm, name: e.target.value })
                        setSignupErrors({ ...signupErrors, name: undefined })
                      }}
                      disabled={isLoading}
                    />
                  </div>
                  {signupErrors.name && (
                    <p className="text-sm text-red-500">{signupErrors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-gray-700 font-medium">
                    Adresse email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="vous@exemple.com"
                      className={`pl-10 ${signupErrors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      value={signupForm.email}
                      onChange={(e) => {
                        setSignupForm({ ...signupForm, email: e.target.value })
                        setSignupErrors({ ...signupErrors, email: undefined })
                      }}
                      disabled={isLoading}
                    />
                  </div>
                  {signupErrors.email && (
                    <p className="text-sm text-red-500">{signupErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-gray-700 font-medium">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`pl-10 pr-10 ${signupErrors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      value={signupForm.password}
                      onChange={(e) => {
                        setSignupForm({ ...signupForm, password: e.target.value })
                        setSignupErrors({ ...signupErrors, password: undefined })
                      }}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {signupErrors.password && (
                    <p className="text-sm text-red-500">{signupErrors.password}</p>
                  )}
                  {signupForm.password && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              signupForm.password.length < 8 
                                ? 'w-1/3 bg-red-500' 
                                : signupForm.password.length < 12 
                                ? 'w-2/3 bg-yellow-500' 
                                : 'w-full bg-green-500'
                            }`}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {signupForm.password.length < 8 
                            ? 'Faible' 
                            : signupForm.password.length < 12 
                            ? 'Moyen' 
                            : 'Fort'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password" className="text-gray-700 font-medium">
                    Confirmer le mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`pl-10 pr-10 ${signupErrors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      value={signupForm.confirmPassword}
                      onChange={(e) => {
                        setSignupForm({ ...signupForm, confirmPassword: e.target.value })
                        setSignupErrors({ ...signupErrors, confirmPassword: undefined })
                      }}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {signupErrors.confirmPassword && (
                    <p className="text-sm text-red-500">{signupErrors.confirmPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={signupForm.terms}
                      onCheckedChange={(checked) => {
                        setSignupForm({ ...signupForm, terms: checked as boolean })
                        setSignupErrors({ ...signupErrors, terms: undefined })
                      }}
                      disabled={isLoading}
                      className={signupErrors.terms ? 'border-red-500' : ''}
                    />
                    <Label 
                      htmlFor="terms" 
                      className="text-sm text-gray-600 font-normal cursor-pointer leading-relaxed"
                    >
                      J'accepte les{" "}
                      <a href="/terms" className="text-fitnest-green hover:underline font-medium">
                        conditions d'utilisation
                      </a>{" "}
                      et la{" "}
                      <a href="/privacy" className="text-fitnest-green hover:underline font-medium">
                        politique de confidentialité
                      </a>
                    </Label>
                  </div>
                  {signupErrors.terms && (
                    <p className="text-sm text-red-500">{signupErrors.terms}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-fitnest-orange to-orange-500 hover:from-orange-500 hover:to-fitnest-orange text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    "Créer mon compte"
                  )}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Ou s'inscrire avec</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full hover:bg-gray-50"
                    disabled={isLoading}
                    onClick={() => console.log("Google signup")}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full hover:bg-gray-50"
                    disabled={isLoading}
                    onClick={() => console.log("Facebook signup")}
                  >
                    <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
