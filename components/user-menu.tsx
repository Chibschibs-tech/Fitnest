"use client"

import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  ShoppingBag, 
  Heart, 
  Settings, 
  LogOut,
  ChevronDown,
  CreditCard,
  Bell
} from "lucide-react"
import Link from "next/link"

interface UserMenuProps {
  user: {
    name: string
    email: string
    avatar?: string
  }
  onLogout: () => void
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false)

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 hover:bg-gray-100 rounded-xl focus-visible:ring-2 focus-visible:ring-fitnest-green px-2 py-1.5"
        >
          <Avatar className="h-8 w-8 ring-2 ring-fitnest-green/20">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-br from-fitnest-green to-fitnest-orange text-white text-xs font-semibold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:inline-block text-sm font-medium text-gray-700">
            {user.name.split(' ')[0]}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-500 hidden md:block" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        className="w-64 p-2" 
        align="end"
        sideOffset={8}
      >
        {/* User Info */}
        <DropdownMenuLabel className="p-3 bg-gradient-to-br from-fitnest-green/10 to-fitnest-orange/10 rounded-lg mb-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-white">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-fitnest-green to-fitnest-orange text-white font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Menu Items */}
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link 
              href="/profile" 
              className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setOpen(false)}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Mon profil</p>
                <p className="text-xs text-gray-500">Gérer vos informations</p>
              </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link 
              href="/orders" 
              className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setOpen(false)}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-fitnest-orange/10">
                <ShoppingBag className="h-4 w-4 text-fitnest-orange" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Mes commandes</p>
                <p className="text-xs text-gray-500">Suivre vos commandes</p>
              </div>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg hover:bg-red-50 transition-colors focus:bg-red-50"
          onClick={() => {
            setOpen(false)
            onLogout()
          }}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50">
            <LogOut className="h-4 w-4 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-600">Se déconnecter</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
