# Fitnest Design System

## Overview
This design system defines the visual language and UI patterns used throughout the Fitnest application. It emphasizes clean aesthetics, consistent interactions, and modern web design practices.

---

## Color Palette

### Brand Colors
```css
--fitnest-green: #10b981   /* Primary brand color */
--fitnest-orange: #f97316  /* Secondary/accent color */
```

### Usage Guidelines
- **Green**: Primary actions, success states, meal plans, nutrition-focused features
- **Orange**: Secondary actions, promotional content, alerts, accent elements
- **Gray Scale**: Text, borders, backgrounds (use Tailwind's default gray scale)

### Gradient Patterns
```css
/* Primary Green Gradient */
bg-gradient-to-r from-fitnest-green to-fitnest-green/90

/* Orange Gradient */
bg-gradient-to-r from-fitnest-orange to-orange-500

/* Text Gradients */
bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent

/* Background Gradients */
bg-gradient-to-b from-gray-50 to-white
bg-gradient-to-br from-fitnest-green/10 to-green-50
bg-gradient-to-br from-fitnest-orange/10 to-orange-50
```

---

## Typography

### Headings
```tsx
/* Main Page Title Pattern */
<h1 className="text-4xl md:text-5xl font-bold text-gray-900">
  Regular Text <span className="bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">Gradient Text</span>
</h1>

/* Section Title */
<h2 className="text-3xl md:text-4xl font-bold text-gray-900">
  Section Title
</h2>

/* Card Title */
<h3 className="text-xl md:text-2xl font-bold text-gray-900">
  Card Title
</h3>
```

### Body Text
```css
/* Primary Text */
text-gray-900 font-medium

/* Secondary Text */
text-gray-600 text-sm

/* Muted Text */
text-gray-500 text-xs
```

---

## Components

### Cards

#### Standard Card
```tsx
<div className="rounded-3xl bg-white border-2 border-gray-100 p-6 shadow-lg hover:shadow-2xl hover:border-fitnest-green hover:-translate-y-1 transition-all duration-300">
  {/* Card content */}
</div>
```

#### Card with Gradient Background
```tsx
<div className="rounded-3xl bg-gradient-to-br from-fitnest-green/10 to-green-50 border-2 border-gray-100 p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
  {/* Card content */}
</div>
```

#### Image Card
```tsx
<div className="rounded-3xl overflow-hidden bg-white border-2 border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 group">
  {/* Image container */}
  <div className="relative h-56 overflow-hidden">
    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
    {/* Gradient overlay for text */}
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
      <h3 className="text-lg font-bold text-white">Title</h3>
    </div>
  </div>
</div>
```

### Buttons

#### Primary Button
```tsx
<Button className="bg-gradient-to-r from-fitnest-green to-fitnest-green/90 hover:from-fitnest-green/90 hover:to-fitnest-green text-white font-bold px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
  <span>Button Text</span>
  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
</Button>
```

#### Secondary Button (Orange)
```tsx
<Button className="bg-gradient-to-r from-fitnest-orange to-orange-500 hover:from-orange-500 hover:to-fitnest-orange text-white font-bold px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
  <span>Button Text</span>
  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
</Button>
```

#### Outline Button
```tsx
<Button className="bg-white text-gray-900 border-2 border-gray-200 hover:bg-gray-50 font-bold px-8 py-6 rounded-xl transition-all duration-300">
  Button Text
</Button>
```

### Badges

#### Success/Primary Badge
```tsx
<Badge className="bg-gradient-to-r from-fitnest-green to-green-600 text-white border-0 font-bold shadow-lg">
  Badge Text
</Badge>
```

#### Alert/Warning Badge
```tsx
<Badge className="bg-gradient-to-r from-fitnest-orange to-orange-500 text-white border-0 font-bold shadow-lg flex items-center gap-1">
  <Tag className="h-3 w-3" />
  Badge Text
</Badge>
```

#### Info Badge
```tsx
<Badge className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-md border border-gray-200">
  <Sparkles className="h-4 w-4 text-fitnest-orange" />
  <span className="text-sm font-bold text-gray-900">Badge Text</span>
</Badge>
```

### Icon Containers

#### Gradient Icon Container
```tsx
<div className="w-12 h-12 bg-gradient-to-br from-fitnest-green/10 to-green-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
  <Icon className="h-6 w-6 text-fitnest-green" />
</div>
```

#### Solid Icon Container
```tsx
<div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center shadow-lg">
  <Icon className="h-8 w-8 text-fitnest-green" />
</div>
```

---

## Layout Patterns

### Page Container
```tsx
<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
  {/* Page content */}
</div>
```

### Section Spacing
```css
/* Between major sections */
mt-16 md:mt-20

/* Between subsections */
mt-8 md:mt-12

/* Content padding */
px-4 md:px-6 lg:px-8
```

### Content Width
```css
/* Standard content width */
max-w-6xl mx-auto

/* Narrow content (forms, articles) */
max-w-4xl mx-auto

/* Wide content (product grids) */
max-w-7xl mx-auto
```

### Grid Layouts
```css
/* Product/Card Grid */
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6

/* Two Column Layout */
grid md:grid-cols-2 gap-6

/* Feature Grid */
grid grid-cols-1 md:grid-cols-3 gap-8
```

---

## Interactions & Animations

### Hover Effects

#### Card Hover
```css
hover:shadow-2xl hover:border-fitnest-green hover:-translate-y-1 transition-all duration-300
```

#### Button Hover
```css
hover:shadow-xl transition-all duration-300 group
/* Icon animation inside */
group-hover:translate-x-1 transition-transform
```

#### Image Hover
```css
group-hover:scale-110 transition-transform duration-500
```

### Focus States
```css
/* Input Focus */
focus:ring-2 focus:ring-fitnest-green focus:border-fitnest-green

/* Button Focus */
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green
```

### Disabled States
```css
disabled:opacity-50 disabled:cursor-not-allowed
```

---

## Form Elements

### Input Fields
```tsx
<Input className="rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-fitnest-green focus:border-fitnest-green px-4 py-3" />
```

### Labels
```tsx
<Label className="text-sm font-bold text-gray-900">
  Label Text <span className="text-red-500">*</span>
</Label>
```

### Textarea
```tsx
<Textarea className="rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-fitnest-green resize-none" />
```

---

## Page Header Pattern

### Standard Header
```tsx
<div className="text-center mb-12 md:mb-16">
  {/* Badge */}
  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-fitnest-green/10 to-green-50 rounded-full px-4 py-2 mb-6">
    <Icon className="h-4 w-4 text-fitnest-green" />
    <span className="text-sm font-bold text-gray-900">Section Label</span>
  </div>
  
  {/* Title */}
  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
    Page Title{" "}
    <span className="bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">
      Gradient
    </span>
  </h1>
  
  {/* Description */}
  <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
    Brief description or tagline
  </p>
</div>
```

---

## Loading & Empty States

### Loading State
```tsx
<div className="flex flex-col items-center justify-center py-20">
  <div className="w-20 h-20 bg-gradient-to-br from-fitnest-green/10 to-green-100 rounded-2xl flex items-center justify-center mb-6">
    <Loader2 className="h-10 w-10 text-fitnest-green animate-spin" />
  </div>
  <p className="text-lg font-bold text-gray-900 mb-2">Loading...</p>
  <p className="text-sm text-gray-600">Please wait</p>
</div>
```

### Empty State
```tsx
<div className="flex flex-col items-center justify-center py-20">
  <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
    <Icon className="h-10 w-10 text-gray-400" />
  </div>
  <h3 className="text-xl font-bold text-gray-900 mb-2">No Items Found</h3>
  <p className="text-sm text-gray-600 mb-6">Description of empty state</p>
  <Button>Action Button</Button>
</div>
```

### Error State
```tsx
<Alert className="rounded-2xl border-2 border-red-100 bg-red-50">
  <AlertCircle className="h-5 w-5 text-red-600" />
  <AlertTitle className="text-lg font-bold text-red-900">Error Title</AlertTitle>
  <AlertDescription className="text-sm text-red-700">Error description</AlertDescription>
</Alert>
```

---

## Accessibility Guidelines

### Color Contrast
- Ensure text has sufficient contrast against backgrounds
- Use `text-gray-900` for primary text on light backgrounds
- Use `text-white` on dark or colored backgrounds

### Focus Indicators
- Always include visible focus states for keyboard navigation
- Use `focus:ring-2 focus:ring-fitnest-green` for form inputs
- Use `focus-visible:outline-none focus-visible:ring-2` for buttons

### Alt Text
- Always provide descriptive alt text for images
- Use empty alt (`alt=""`) for decorative images

### Semantic HTML
- Use proper heading hierarchy (h1 → h2 → h3)
- Use semantic tags (`<nav>`, `<main>`, `<article>`, `<section>`)

---

## Responsive Design

### Breakpoints (Tailwind defaults)
```css
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
```

### Mobile-First Approach
```tsx
/* Mobile base style, then override for larger screens */
className="text-2xl md:text-3xl lg:text-4xl"
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
className="px-4 md:px-6 lg:px-8"
```

---

## Best Practices

### Do's ✅
- Use consistent spacing (multiples of 4: 4, 8, 12, 16, 20, 24)
- Apply rounded corners generously (`rounded-xl`, `rounded-2xl`, `rounded-3xl`)
- Include hover states for all interactive elements
- Use gradients sparingly for accent and emphasis
- Maintain consistent shadow hierarchy (`shadow-lg`, `shadow-xl`, `shadow-2xl`)
- Group related content with cards
- Use icons to enhance visual communication
- Provide clear feedback for user actions

### Don'ts ❌
- Avoid complex multi-stop gradients (keep it simple: 2 colors max)
- Don't use multiple bright colors on the same element
- Avoid glossy or overly decorative effects
- Don't mix different border radius values in the same section
- Avoid inconsistent spacing patterns
- Don't use animations that distract from content
- Avoid full-page overlays or decorative blur circles

---

## Icon Library
**Lucide React** is the primary icon library

### Common Icons
```tsx
import {
  ChevronRight,  // Navigation arrows
  Sparkles,      // Special features, highlights
  Package,       // Products, deliveries
  CheckCircle,   // Success, completion
  AlertCircle,   // Errors, warnings
  Loader2,       // Loading states
  Heart,         // Favorites, likes
  ShoppingBag,   // Cart, shopping
  Mail,          // Contact, email
  Phone,         // Phone contact
  MapPin,        // Location, address
  ArrowRight,    // CTAs, next actions
} from 'lucide-react'
```

---

## Code Organization

### Component Structure
```tsx
// 1. Imports
import React from 'react'
import { Button } from '@/components/ui/button'
import { Icon } from 'lucide-react'

// 2. Type definitions
interface Props {
  // ...
}

// 3. Component
export function Component({ ...props }: Props) {
  // 4. State and hooks
  
  // 5. Event handlers
  
  // 6. Render
  return (
    <div>
      {/* Main content */}
    </div>
  )
}
```

### Tailwind Class Order
1. Layout (display, position, flexbox, grid)
2. Sizing (width, height, padding, margin)
3. Typography (font, text size, color)
4. Backgrounds and borders
5. Effects (shadow, opacity, transitions)
6. Interactive states (hover, focus, active)

---

## Version
**Version:** 1.0  
**Last Updated:** December 2024  
**Framework:** Next.js + Tailwind CSS + shadcn/ui
