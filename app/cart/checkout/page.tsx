/**
 * Checkout Page
 * Order summary, delivery form, and payment placeholder (cash on delivery).
 * Guests must login or signup via modal (same as meal plan order flow).
 */

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ShoppingCart, Banknote } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useContext } from "react"
import { AuthContext } from "@/components/auth-provider"
import { AuthDialogRefactored } from "@/components/auth-dialog-refactored"
import { useToast } from "@/components/ui/use-toast"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getSubtotal, clearCart } = useCart()
  const { user, setUser } = useContext(AuthContext)
  const { toast } = useToast()
  const [showAuthDialog, setShowAuthDialog] = useState(false)

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart")
    }
  }, [items.length, router])

  // Open auth modal when guest lands on checkout
  useEffect(() => {
    if (!user && items.length > 0) {
      setShowAuthDialog(true)
    } else {
      setShowAuthDialog(false)
    }
  }, [user, items.length])

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Commande envoyée",
      description:
        "Votre commande a bien été enregistrée. Paiement à la livraison.",
    })
    clearCart()
    router.push("/express-shop")
  }

  if (items.length === 0) {
    return null
  }

  const subtotal = getSubtotal()

  const handleAuthSuccess = (userData: { name: string; email: string; avatar?: string }) => {
    setUser(userData)
    setShowAuthDialog(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <AuthDialogRefactored
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        defaultTab="login"
        onAuthSuccess={handleAuthSuccess}
        contextMessage="Pour finaliser votre commande et suivre votre livraison, connectez-vous ou créez un compte."
      />

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Finaliser la commande</h1>
          {!user && (
            <Link href="/cart" className="text-sm font-medium text-fitnest-green hover:underline">
              ← Retour au panier
            </Link>
          )}
        </div>

        {!user ? (
          <div className="space-y-6">
            <Card className="rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif</h2>
                <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex gap-3 items-center py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <ShoppingCart className="h-6 w-6 text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.quantity} × {item.price} MAD</p>
                      </div>
                      <p className="font-semibold text-gray-900">{item.price * item.quantity} MAD</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="font-semibold text-gray-700">Sous-total</span>
                  <span className="text-xl font-bold text-fitnest-green">{subtotal} MAD</span>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-xl border-2 border-fitnest-orange/20 p-8 text-center">
              <p className="text-gray-600 mb-4">
                Connectez-vous ou créez un compte pour finaliser votre commande.
              </p>
              <Button
                onClick={() => setShowAuthDialog(true)}
                className="bg-gradient-to-r from-fitnest-green to-fitnest-green/90 hover:from-fitnest-green/90 hover:to-fitnest-green text-white font-bold rounded-xl"
              >
                Se connecter ou s&apos;inscrire
              </Button>
            </Card>
          </div>
        ) : (
        <form onSubmit={handleConfirmOrder} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Récapitulatif
                </h2>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex gap-3 items-center py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <ShoppingCart className="h-6 w-6 text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} × {item.price} MAD
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {item.price * item.quantity} MAD
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <span className="font-semibold text-gray-700">Sous-total</span>
                  <span className="text-xl font-bold text-fitnest-green">{subtotal} MAD</span>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Informations de livraison
                </h2>
                <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="Jean Dupont"
                    className="mt-1 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="+212 6XX XXX XXX"
                    className="mt-1 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    name="address"
                    required
                    placeholder="123 Rue Example, Casablanca"
                    className="mt-1 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    name="city"
                    required
                    placeholder="Casablanca"
                    className="mt-1 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="note">Note (optionnel)</Label>
                  <Textarea
                    id="note"
                    name="note"
                    placeholder="Instructions spéciales pour la livraison..."
                    className="mt-1 rounded-lg resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          </div>

          <Card className="rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-fitnest-green/10 flex items-center justify-center flex-shrink-0">
                  <Banknote className="h-6 w-6 text-fitnest-green" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Paiement à la livraison
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Payez en espèces lors de la livraison (Cash on delivery).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/cart" className="flex-1">
              <Button
                type="button"
                variant="outline"
                className="w-full border-2 border-gray-200 hover:border-fitnest-green hover:text-fitnest-green font-semibold rounded-xl py-6"
              >
                Retour au panier
              </Button>
            </Link>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-fitnest-green to-fitnest-green/90 hover:from-fitnest-green/90 hover:to-fitnest-green text-white font-bold rounded-xl py-6 shadow-lg"
            >
              Confirmer la commande
            </Button>
          </div>
        </form>
        )}
      </div>
    </div>
  )
}
