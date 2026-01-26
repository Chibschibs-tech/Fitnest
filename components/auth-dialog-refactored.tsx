/**
 * Authentication Dialog - Refactored
 * Clean, maintainable authentication UI using custom hooks and services
 */

"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Lock, Mail, User, Loader2 } from "lucide-react"
import type { AuthTab, User as UserType } from "@/types/auth.types"
import { useLoginForm } from "@/hooks/use-login-form"
import { useSignupForm } from "@/hooks/use-signup-form"
import { getPasswordStrengthColor, getPasswordStrengthLabel } from "@/utils/validation"

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: AuthTab
  onAuthSuccess?: (user: UserType) => void
}

export function AuthDialogRefactored({ 
  open, 
  onOpenChange, 
  defaultTab = "login", 
  onAuthSuccess 
}: AuthDialogProps) {
  const [activeTab, setActiveTab] = useState<AuthTab>(defaultTab)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Login form hook
  const loginForm = useLoginForm({
    onSuccess: onAuthSuccess,
    onClose: () => onOpenChange(false),
  })

  // Signup form hook
  const signupForm = useSignupForm({
    onSuccess: onAuthSuccess,
    onClose: () => onOpenChange(false),
  })

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

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AuthTab)} className="mt-6">
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
              <form onSubmit={loginForm.handleSubmit} className="space-y-4">
                {/* Email Field */}
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
                      className={`pl-10 ${loginForm.errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      value={loginForm.form.email}
                      onChange={(e) => loginForm.updateField('email', e.target.value)}
                      disabled={loginForm.isLoading}
                    />
                  </div>
                  {loginForm.errors.email && (
                    <p className="text-sm text-red-500">{loginForm.errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
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
                      className={`pl-10 pr-10 ${loginForm.errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      value={loginForm.form.password}
                      onChange={(e) => loginForm.updateField('password', e.target.value)}
                      disabled={loginForm.isLoading}
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
                  {loginForm.errors.password && (
                    <p className="text-sm text-red-500">{loginForm.errors.password}</p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={loginForm.form.remember}
                      onCheckedChange={(checked) => loginForm.updateField('remember', checked as boolean)}
                      disabled={loginForm.isLoading}
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-600 font-normal cursor-pointer">
                      Se souvenir de moi
                    </Label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-fitnest-green hover:text-fitnest-green/80 font-medium transition-colors"
                    onClick={() => console.log("Forgot password clicked")}
                  >
                    Mot de passe oublié ?
                  </button>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-fitnest-green to-emerald-600 hover:from-emerald-600 hover:to-fitnest-green text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                  disabled={loginForm.isLoading}
                >
                  {loginForm.isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connexion en cours...
                    </>
                  ) : (
                    "Se connecter"
                  )}
                </Button>

                {/* Social Login */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Ou continuer avec</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button type="button" variant="outline" className="w-full hover:bg-gray-50" disabled={loginForm.isLoading}>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                  <Button type="button" variant="outline" className="w-full hover:bg-gray-50" disabled={loginForm.isLoading}>
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
              <form onSubmit={signupForm.handleSubmit} className="space-y-4">
                {/* Name Field */}
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
                      className={`pl-10 ${signupForm.errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      value={signupForm.form.name}
                      onChange={(e) => signupForm.updateField('name', e.target.value)}
                      disabled={signupForm.isLoading}
                    />
                  </div>
                  {signupForm.errors.name && (
                    <p className="text-sm text-red-500">{signupForm.errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
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
                      className={`pl-10 ${signupForm.errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      value={signupForm.form.email}
                      onChange={(e) => signupForm.updateField('email', e.target.value)}
                      disabled={signupForm.isLoading}
                    />
                  </div>
                  {signupForm.errors.email && (
                    <p className="text-sm text-red-500">{signupForm.errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
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
                      className={`pl-10 pr-10 ${signupForm.errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      value={signupForm.form.password}
                      onChange={(e) => signupForm.updateField('password', e.target.value)}
                      disabled={signupForm.isLoading}
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
                  {signupForm.errors.password && (
                    <p className="text-sm text-red-500">{signupForm.errors.password}</p>
                  )}
                  
                  {/* Password Strength Indicator */}
                  {signupForm.form.password && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${getPasswordStrengthColor(signupForm.form.password)} ${
                              signupForm.form.password.length < 8 ? 'w-1/3' : 
                              signupForm.form.password.length < 12 ? 'w-2/3' : 'w-full'
                            }`}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {getPasswordStrengthLabel(signupForm.form.password)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
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
                      className={`pl-10 pr-10 ${signupForm.errors.password_confirmation ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      value={signupForm.form.password_confirmation}
                      onChange={(e) => signupForm.updateField('password_confirmation', e.target.value)}
                      disabled={signupForm.isLoading}
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
                  {signupForm.errors.password_confirmation && (
                    <p className="text-sm text-red-500">{signupForm.errors.password_confirmation}</p>
                  )}
                </div>

                {/* Terms Checkbox */}
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={signupForm.form.terms}
                      onCheckedChange={(checked) => signupForm.updateField('terms', checked as boolean)}
                      disabled={signupForm.isLoading}
                      className={signupForm.errors.terms ? 'border-red-500' : ''}
                    />
                    <Label htmlFor="terms" className="text-sm text-gray-600 font-normal cursor-pointer leading-relaxed">
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
                  {signupForm.errors.terms && (
                    <p className="text-sm text-red-500">{signupForm.errors.terms}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-fitnest-orange to-orange-500 hover:from-orange-500 hover:to-fitnest-orange text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                  disabled={signupForm.isLoading}
                >
                  {signupForm.isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    "Créer mon compte"
                  )}
                </Button>

                {/* Social Signup */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Ou s'inscrire avec</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button type="button" variant="outline" className="w-full hover:bg-gray-50" disabled={signupForm.isLoading}>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                  <Button type="button" variant="outline" className="w-full hover:bg-gray-50" disabled={signupForm.isLoading}>
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
