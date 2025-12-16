# Home Page Components

This directory contains modular components for the home page, making it easier to maintain and update.

## Structure

```
components/home/
├── HeroSection.tsx          # Hero banner with headline and CTAs
├── TrustBar.tsx             # Quick stats bar (delivery time, rating, etc.)
├── MealPlansSection.tsx     # Featured meal plans grid
├── HowItWorksSection.tsx    # 3-step process explanation
├── FeaturesSection.tsx      # Why Choose Fitnest features
├── TestimonialsSection.tsx  # Customer testimonials
├── ExpressShopSection.tsx   # Featured products from Express Shop
├── CTASection.tsx           # Final call-to-action section
├── index.ts                 # Re-exports all components
└── README.md               # This file
```

## API & Types

API functions and TypeScript types are centralized in:
- `lib/api/home.ts` - Contains `getMealPlans()`, `getProducts()`, and their types

## Usage

The main page (`app/home/page.tsx`) imports and composes these components:

```tsx
import { getMealPlans, getProducts } from "@/lib/api/home"
import {
  HeroSection,
  TrustBar,
  MealPlansSection,
  // ... other components
} from "@/components/home"

export default async function Home() {
  const mealPlans = await getMealPlans()
  const products = await getProducts()
  
  return (
    <div>
      <HeroSection />
      <TrustBar />
      <MealPlansSection mealPlans={mealPlans} />
      {/* ... other sections */}
    </div>
  )
}
```

## Benefits of This Structure

1. **Maintainability**: Each section is in its own file, making it easy to locate and update
2. **Reusability**: Components can be reused in other pages if needed
3. **Testability**: Each component can be tested independently
4. **Clarity**: Clear separation of concerns
5. **Performance**: Data fetching is optimized with Promise.all()

## Editing a Section

To edit a specific section:
1. Open the corresponding component file (e.g., `HeroSection.tsx`)
2. Make your changes
3. The home page will automatically use the updated component

## Adding a New Section

1. Create a new component file in this directory
2. Export it from `index.ts`
3. Import and use it in `app/home/page.tsx`
