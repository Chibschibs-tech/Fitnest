"use client"

import { useEffect, useState, useContext } from "react"
import { format } from "date-fns"
import Image from "next/image"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  UtensilsCrossed,
  Package,
  Loader2,
  CheckCircle2,
  Edit2,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { AuthDialogRefactored } from "@/components/auth-dialog-refactored"
import { AuthContext } from "@/components/auth-provider"
import {
  MealPlan,
  OrderPreferences,
  MenuBuildData,
  ContactInfo,
  Address,
  OrderData,
  Meal
} from "../types"

// Helper function to format date as Y-m-d
const formatDateYMD = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

interface ReviewAndConfirmProps {
  selectedPlan: MealPlan
  preferences: OrderPreferences
  menuData: MenuBuildData
  meals: Meal[]
  onSubmit: (orderData: OrderData) => Promise<void>
  onBack: () => void
}

export function ReviewAndConfirm({
  selectedPlan,
  preferences,
  menuData,
  meals,
  onSubmit,
  onBack
}: ReviewAndConfirmProps) {
  const { setUser } = useContext(AuthContext)
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: '',
    email: '',
    phone: '',
  })

  const [address, setAddress] = useState<Address>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Morocco',
    additionalInfo: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Get meal details by ID
  const getMealById = (id: string | undefined) => {
    if (!id) {
      console.warn('getMealById called with undefined id')
      return null
    }
    // Convert both to strings for comparison to handle type mismatches
    const meal = meals.find(m => String(m.id) === String(id))
    if (!meal) {
      console.warn(`Meal not found for id: ${id}`, 'Available meal IDs:', meals.map(m => m.id))
    }
    return meal
  }

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    setIsAuthenticated(!!token)
  }, [])

  // Add debugging to see what we have
  useEffect(() => {
    console.log('Review - Available meals:', meals.length)
    console.log('Review - Menu selections:', menuData.selections)
    console.log('Review - Preferences:', preferences)
  }, [meals, menuData, preferences])


  // Calculate total price (simplified - adjust based on your pricing model)
  const calculateTotal = () => {
    let total = 0
    preferences.selectedMeals.forEach(mealType => {
      const priceKey = `${mealType}_price_per_day` as keyof MealPlan
      total += (selectedPlan[priceKey] as number) * preferences.deliveryDays.length
    })
    total += selectedPlan.snack_price_per_day * preferences.snacksPerDay * preferences.deliveryDays.length
    return total
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Contact validation
    if (!contactInfo.name.trim()) {
      newErrors.name = 'Le nom est requis'
    }
    if (!contactInfo.email.trim()) {
      newErrors.email = 'L\'email est requis'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
      newErrors.email = 'Format d\'email invalide'
    }
    if (!contactInfo.phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est requis'
    }

    // Address validation
    if (!address.street.trim()) {
      newErrors.street = 'L\'adresse est requise'
    }
    if (!address.city.trim()) {
      newErrors.city = 'La ville est requise'
    }
    if (!address.zipCode.trim()) {
      newErrors.zipCode = 'Le code postal est requis'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinueToReview = () => {
    if (!validateForm()) return

    // Check if user is authenticated
    const token = localStorage.getItem('authToken')
    if (!token) {
      setShowAuthDialog(true)
      return
    }

    setShowReview(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAuthSuccess = (userData: { name: string; email: string; avatar?: string; id?: string | number; role?: string }) => {
    // Update global auth context so navbar reflects logged-in state
    setUser(userData)
    
    setShowAuthDialog(false)
    setIsAuthenticated(true)
    setShowReview(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        contactInfo,
        address,
      })
    } catch (error) {
      console.error('Submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Contact & Address Form
  if (!showReview) {
    return (
      <>
        <AuthDialogRefactored 
          open={showAuthDialog}
          onOpenChange={setShowAuthDialog}
          defaultTab="login"
          onAuthSuccess={handleAuthSuccess}
          contextMessage="Pour finaliser votre commande et suivre votre livraison, connectez-vous ou créez un compte rapidement."
        />
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-fitnest-green" />
              Informations de Contact
            </CardTitle>
            <CardDescription>
              Nous utiliserons ces informations pour communiquer au sujet de votre commande
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nom Complet <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    placeholder="Nom Prénom"
                    value={contactInfo.name}
                    onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                    className={cn("pl-10", errors.name && "border-red-500")}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Numéro de Téléphone <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+212 6XX XXX XXX"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    className={cn("pl-10", errors.phone && "border-red-500")}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-500">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">
                  Adresse Email <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nom@exemple.com"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    className={cn("pl-10", errors.email && "border-red-500")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
            </div>
          </CardContent>
        </Card>

        {/* Delivery Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-fitnest-green" />
              Adresse de Livraison
            </CardTitle>
            <CardDescription>
              Où devons-nous livrer vos repas ?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="street">
                  Adresse <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="street"
                  placeholder="123 Rue Principale, Apt 4B"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className={errors.street ? "border-red-500" : ""}
                />
                {errors.street && (
                  <p className="text-xs text-red-500">{errors.street}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">
                  Ville <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="city"
                  placeholder="Casablanca"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && (
                  <p className="text-xs text-red-500">{errors.city}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">État/Province</Label>
                <Input
                  id="state"
                  placeholder="Casablanca-Settat"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zipCode">
                  Code Postal <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="zipCode"
                  placeholder="20000"
                  value={address.zipCode}
                  onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                  className={errors.zipCode ? "border-red-500" : ""}
                />
                {errors.zipCode && (
                  <p className="text-xs text-red-500">{errors.zipCode}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Pays</Label>
                <Input
                  id="country"
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="additionalInfo">
                  Informations Complémentaires (Optionnel)
                </Label>
                <Textarea
                  id="additionalInfo"
                  placeholder="Nom du bâtiment, étage, instructions de livraison spéciales..."
                  value={address.additionalInfo}
                  onChange={(e) => setAddress({ ...address, additionalInfo: e.target.value })}
                  rows={3}
                />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={onBack}
                size="lg"
                className="font-bold px-8 py-6 rounded-xl border-2 hover:bg-gray-50"
              >
                <span>Retour</span>
              </Button>
              <Button
                onClick={handleContinueToReview}
                className="bg-gradient-to-r from-fitnest-green to-fitnest-green/90 hover:from-fitnest-green/90 hover:to-fitnest-green text-white font-bold px-10 py-7 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                size="lg"
              >
                <span>Vérifier la Commande</span>
                <CheckCircle2 className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </>
    )
  }

  // Order Review
  return (
    <>
      <AuthDialogRefactored 
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        defaultTab="login"
        onAuthSuccess={handleAuthSuccess}
        contextMessage="Pour finaliser votre commande et suivre votre livraison, connectez-vous ou créez un compte rapidement."
      />
      <div className="space-y-6">
      {/* Review Header */}
      <Card className="border-fitnest-green">
        <CardHeader className="bg-fitnest-green/5">
          <CardTitle className="flex items-center gap-2 text-fitnest-green">
            <CheckCircle2 className="h-6 w-6" />
            Vérifiez votre Commande
          </CardTitle>
          <CardDescription>
            Veuillez vérifier tous les détails avant de confirmer votre commande
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Contact & Address Review */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Informations de Contact
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReview(false)}
              >
                <Edit2 className="h-3 w-3 mr-1" />
                Modifier
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <p className="text-gray-500">Nom</p>
              <p className="font-medium">{contactInfo.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium">{contactInfo.email}</p>
            </div>
            <div>
              <p className="text-gray-500">Téléphone</p>
              <p className="font-medium">{contactInfo.phone}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Adresse de Livraison
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReview(false)}
              >
                <Edit2 className="h-3 w-3 mr-1" />
                Modifier
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-medium">{address.street}</p>
            <p>{address.city}, {address.state}</p>
            <p>{address.zipCode}, {address.country}</p>
            {address.additionalInfo && (
              <p className="text-gray-600 mt-2 text-xs">{address.additionalInfo}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Meal Plan Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="h-4 w-4" />
            Détails du Meal Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={selectedPlan.image}
                alt={selectedPlan.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold">{selectedPlan.name}</h3>
              <p className="text-sm text-gray-600">
                {preferences.selectedMeals.join(', ')}
                {preferences.snacksPerDay > 0 && ` + ${preferences.snacksPerDay} snack${preferences.snacksPerDay > 1 ? 's' : ''}`}
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Durée</p>
              <p className="font-medium">{preferences.duration} semaine{preferences.duration > 1 ? 's' : ''}</p>
            </div>
            <div>
              <p className="text-gray-500">Jours de Livraison</p>
              <p className="font-medium">{preferences.deliveryDays.length} jours</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Schedule */}
      <Card>
  <CardHeader>
    <CardTitle className="text-base flex items-center gap-2">
      <Calendar className="h-4 w-4" />
      Calendrier de Livraison & Repas
    </CardTitle>
    <CardDescription>
      Votre meal plan complet pour chaque jour de livraison
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      {preferences.deliveryDays
        .sort((a, b) => a.getTime() - b.getTime())
        .map((day, dayIndex) => {
          const dayKey = formatDateYMD(day)
          const daySelections = menuData.selections[dayKey] || {}
          
          // Debug log
          console.log(`Day ${dayIndex + 1} (${dayKey}) selections:`, daySelections)
          
          // Get all meals for this day
          const dayMeals = [
            ...preferences.selectedMeals.map(mealType => ({
              type: mealType,
              meal: getMealById(daySelections[mealType]),
              badge: mealType,
              badgeColor: 'bg-fitnest-green'
            })),
            ...Array.from({ length: preferences.snacksPerDay }).map((_, i) => {
              const snackKey = `snack${i + 1}`
              return {
                type: snackKey,
                meal: getMealById(daySelections[snackKey]),
                badge: `Snack ${i + 1}`,
                badgeColor: 'bg-orange-500'
              }
            })
          ].filter(item => item.meal !== null && item.meal !== undefined)

          if (dayMeals.length === 0) {
            return (
              <div key={dayKey} className="border rounded-lg p-4 bg-yellow-50">
                <p className="text-sm text-yellow-800">
                  ⚠️ No meals found for {format(day, 'EEEE, MMMM d')}. Please go back and rebuild your menu.
                </p>
              </div>
            )
          }
          
          return (
            <div key={dayKey} className="border rounded-lg overflow-hidden">
              {/* Day Header */}
              <div className="bg-gray-50 px-4 py-3 border-b">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-fitnest-green text-white flex items-center justify-center text-xs">
                      {dayIndex + 1}
                    </div>
                    {format(day, 'EEEE, MMMM d, yyyy')}
                  </h4>
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                    {dayMeals.length} articles
                  </span>
                </div>
              </div>

              {/* Meals Grid */}
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {dayMeals.map(({ type, meal, badge, badgeColor }) => {
                    if (!meal) return null
                    
                    return (
                      <div key={type} className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
                        {/* Meal Image */}
                        <div className="relative h-24 w-full bg-gray-100">
                          <Image
                            src={meal.image}
                            alt={meal.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                          {/* Meal Type Badge */}
                          <div className="absolute top-2 left-2">
                            <span className={`${badgeColor} text-white text-[10px] font-medium px-2 py-1 rounded-full capitalize`}>
                              {badge}
                            </span>
                          </div>
                        </div>

                        {/* Meal Info */}
                        <div className="p-3">
                          <h5 className="font-semibold text-sm mb-1 line-clamp-1">
                            {meal.name}
                          </h5>
                          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                            {meal.description || 'No description'}
                          </p>

                          {/* Nutrition Grid */}
                          <div className="grid grid-cols-4 gap-1 pt-2 border-t border-gray-100">
                            <div className="text-center">
                              <p className="text-[10px] text-gray-500">Cal</p>
                              <p className="text-xs font-semibold">{meal.calories || 0}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] text-gray-500">Pro</p>
                              <p className="text-xs font-semibold">{meal.protein || 0}g</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] text-gray-500">Glu</p>
                              <p className="text-xs font-semibold">{meal.carbohydrates || 0}g</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] text-gray-500">Lip</p>
                              <p className="text-xs font-semibold">{meal.fats || 0}g</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Daily Nutrition Summary */}
                {dayMeals.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                      <span className="text-gray-500 font-medium">Totaux Journaliers :</span>
                      <div className="flex gap-4 flex-wrap">
                        <span>
                          <span className="font-semibold text-fitnest-green">
                            {dayMeals.reduce((sum, { meal }) => sum + (meal?.calories || 0), 0)}
                          </span>{' '}
                          <span className="text-gray-500">cal</span>
                        </span>
                        <span>
                          <span className="font-semibold text-fitnest-green">
                            {dayMeals.reduce((sum, { meal }) => sum + (meal?.protein || 0), 0)}g
                          </span>{' '}
                          <span className="text-gray-500">protéines</span>
                        </span>
                        <span>
                          <span className="font-semibold text-fitnest-green">
                            {dayMeals.reduce((sum, { meal }) => sum + (meal?.carbohydrates || 0), 0)}g
                          </span>{' '}
                          <span className="text-gray-500">glucides</span>
                        </span>
                        <span>
                          <span className="font-semibold text-fitnest-green">
                            {dayMeals.reduce((sum, { meal }) => sum + (meal?.fats || 0), 0)}g
                          </span>{' '}
                          <span className="text-gray-500">lipides</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
    </div>
  </CardContent>
</Card>

      {/* Order Total */}
      <Card className="border-fitnest-green">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Repas</span>
              <span>{calculateTotal().toFixed(2)} MAD</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Livraison</span>
              <span className="text-green-600">Gratuit</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-fitnest-green">{calculateTotal().toFixed(2)} MAD</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms & Submit */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <Alert>
            <AlertDescription className="text-xs">
              En confirmant cette commande, vous acceptez nos Conditions d'Utilisation et notre Politique de Confidentialité. Vous pouvez modifier ou annuler votre abonnement à tout moment.
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowReview(false)}
              size="lg"
              disabled={isSubmitting}
              className="font-bold px-8 py-6 rounded-xl border-2 hover:bg-gray-50 disabled:opacity-50"
            >
              <span>Retour à la Modification</span>
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-fitnest-orange to-orange-500 hover:from-orange-500 hover:to-fitnest-orange text-white font-bold px-10 py-7 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span>Traitement en cours...</span>
                </>
              ) : (
                <>
                  <span>Confirmer la Commande</span>
                  <CheckCircle2 className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </>
  )
}
