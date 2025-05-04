import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"

// This would typically come from a database or CMS
const blogPosts = {
  "healthy-meal-prep": {
    title: "10 Healthy Meal Prep Tips for Busy Professionals",
    excerpt: "Learn how to efficiently prepare nutritious meals for the entire week, even with a busy schedule.",
    date: "May 2, 2025",
    author: "Nadia Benali",
    image: "/blog-meal-prep.png",
    category: "Meal Prep",
    readTime: "5 min read",
    content: `
      <p>Meal prepping is a game-changer for busy professionals who want to maintain a healthy diet without spending hours in the kitchen every day. Here are 10 tips to make meal prepping efficient and effective:</p>
      
      <h2>1. Plan Your Menu</h2>
      <p>Before grocery shopping, plan your meals for the week. Consider your schedule and choose recipes that align with your nutritional goals.</p>
      
      <h2>2. Start Small</h2>
      <p>If you're new to meal prepping, begin by preparing just 2-3 days worth of meals to avoid feeling overwhelmed.</p>
      
      <h2>3. Batch Cook Proteins</h2>
      <p>Cook larger portions of proteins like chicken, beef, or tofu that can be used in different meals throughout the week.</p>
      
      <h2>4. Roast Vegetables in Bulk</h2>
      <p>Roast a variety of vegetables on sheet pans to use as sides or in salads, grain bowls, and wraps.</p>
      
      <h2>5. Invest in Quality Containers</h2>
      <p>Good storage containers keep food fresh longer and make transportation easier. Look for glass containers with secure lids.</p>
      
      <h2>6. Utilize Your Freezer</h2>
      <p>Many prepped meals freeze well. Prepare double batches and freeze half for future weeks when you're extra busy.</p>
      
      <h2>7. Prep Ingredients, Not Just Meals</h2>
      <p>Sometimes just having washed, chopped vegetables and cooked grains ready to go can make weeknight cooking much faster.</p>
      
      <h2>8. Create Versatile Bases</h2>
      <p>Prepare bases like quinoa, brown rice, or roasted sweet potatoes that can be used in multiple different meals.</p>
      
      <h2>9. Don't Forget Healthy Snacks</h2>
      <p>Portion out nuts, cut vegetables, or prepare protein bites for grab-and-go snacks during busy days.</p>
      
      <h2>10. Set Aside Dedicated Prep Time</h2>
      <p>Schedule 1-2 hours on a weekend or less busy day specifically for meal prepping. Consistency is key!</p>
      
      <p>With these strategies, you can enjoy nutritious, home-cooked meals all week while saving time, money, and reducing stress around mealtime decisions.</p>
    `,
  },
  "nutrition-myths": {
    title: "5 Common Nutrition Myths Debunked",
    excerpt: "Separating fact from fiction: nutrition experts weigh in on popular diet claims and misconceptions.",
    date: "April 28, 2025",
    author: "Dr. Karim Alaoui",
    image: "/blog-nutrition-myths.png",
    category: "Nutrition",
    readTime: "7 min read",
    content: `
      <p>In the world of nutrition, misinformation spreads quickly. Let's examine five common nutrition myths and reveal the scientific truth behind them.</p>
      
      <h2>Myth 1: Carbs Are Bad for You</h2>
      <p>Reality: Carbohydrates are a crucial macronutrient and your body's preferred energy source. The key is choosing complex carbs like whole grains, fruits, and vegetables over refined carbs and added sugars.</p>
      
      <h2>Myth 2: Eating Fat Makes You Fat</h2>
      <p>Reality: Dietary fat doesn't automatically convert to body fat. Healthy fats from sources like avocados, nuts, and olive oil are essential for hormone production, brain health, and nutrient absorption.</p>
      
      <h2>Myth 3: Detox Diets Cleanse Your Body</h2>
      <p>Reality: Your liver and kidneys naturally detoxify your body. Most "detox" products have no scientific backing. Staying hydrated and eating a balanced diet supports your body's natural detoxification processes.</p>
      
      <h2>Myth 4: You Need to Eat Every 2-3 Hours to Boost Metabolism</h2>
      <p>Reality: Meal frequency has minimal impact on metabolism. Total daily calorie intake matters more than how often you eat. Choose an eating pattern that works for your lifestyle and helps you maintain a healthy diet.</p>
      
      <h2>Myth 5: All Calories Are Equal</h2>
      <p>Reality: While calorie balance matters for weight management, the nutritional value of those calories significantly impacts health. 200 calories from vegetables provide fiber, vitamins, and minerals, while 200 calories from processed foods offer little nutritional benefit.</p>
      
      <p>Understanding these nutrition facts can help you make more informed dietary choices based on science rather than popular trends or misconceptions.</p>
    `,
  },
  "protein-sources": {
    title: "Best Plant-Based Protein Sources for Vegetarians",
    excerpt: "Discover delicious and protein-rich plant foods that can help you meet your fitness goals.",
    date: "April 21, 2025",
    author: "Leila Tazi",
    image: "/blog-plant-protein.png",
    category: "Nutrition",
    readTime: "6 min read",
    content: `
      <p>Whether you're a long-time vegetarian or simply trying to reduce your meat consumption, getting enough protein is essential for muscle maintenance, immune function, and overall health. Here are some excellent plant-based protein sources:</p>
      
      <h2>Legumes</h2>
      <p>Lentils, chickpeas, and all varieties of beans are protein powerhouses, offering about 15g of protein per cooked cup. They're also rich in fiber, iron, and complex carbohydrates.</p>
      
      <h2>Tofu and Tempeh</h2>
      <p>Made from soybeans, tofu provides 20g of protein per cup, while tempeh offers even more at 31g per cup. Both are complete proteins containing all essential amino acids.</p>
      
      <h2>Seitan</h2>
      <p>Made from vital wheat gluten, seitan contains about 25g of protein per 3.5 ounces, making it one of the richest plant protein sources available.</p>
      
      <h2>Quinoa</h2>
      <p>This ancient grain provides 8g of complete protein per cooked cup, along with fiber and various micronutrients.</p>
      
      <h2>Nuts and Seeds</h2>
      <p>Hemp seeds (10g protein per 3 tbsp), chia seeds, flaxseeds, and nuts like almonds and pistachios are excellent protein sources that also provide healthy fats.</p>
      
      <h2>Nutritional Yeast</h2>
      <p>With 8g of protein per 1/4 cup, nutritional yeast adds a cheesy flavor to dishes while boosting protein content.</p>
      
      <h2>Green Peas</h2>
      <p>Often overlooked, peas contain 8g of protein per cup and are rich in leucine, an amino acid important for muscle synthesis.</p>
      
      <h2>Combining Proteins</h2>
      <p>While many plant foods contain all essential amino acids in varying amounts, combining different protein sources throughout the day ensures you get optimal amino acid profiles.</p>
      
      <p>With these versatile options, vegetarians can easily meet their protein needs while enjoying delicious, nutrient-dense foods.</p>
    `,
  },
  "weight-loss-plateau": {
    title: "Breaking Through a Weight Loss Plateau",
    excerpt: "Effective strategies to overcome stalled progress and continue your weight loss journey.",
    date: "April 15, 2025",
    author: "Youssef Mansouri",
    image: "/blog-weight-loss.png",
    category: "Fitness",
    readTime: "8 min read",
    content: `
      <p>Weight loss plateaus are a normal part of any fitness journey. When the scale stops moving despite your continued efforts, try these evidence-based strategies to get back on track:</p>
      
      <h2>Reassess Your Caloric Needs</h2>
      <p>As you lose weight, your body requires fewer calories. Recalculate your caloric needs based on your current weight, not your starting weight.</p>
      
      <h2>Track Your Food Intake</h2>
      <p>Studies show people tend to underestimate their calorie consumption by 20-30%. Use a food diary or app to ensure accuracy.</p>
      
      <h2>Increase Protein Intake</h2>
      <p>Higher protein diets boost metabolism and reduce hunger. Aim for 25-30% of your calories from protein sources.</p>
      
      <h2>Mix Up Your Workout Routine</h2>
      <p>Your body adapts to exercise over time. Introduce new activities, increase intensity, or try interval training to challenge your body in different ways.</p>
      
      <h2>Add Strength Training</h2>
      <p>Building muscle increases your resting metabolic rate. Include resistance exercises 2-3 times per week.</p>
      
      <h2>Manage Stress</h2>
      <p>Chronic stress increases cortisol, which can promote fat storage, especially around the abdomen. Incorporate stress-reduction techniques like meditation or yoga.</p>
      
      <h2>Improve Sleep Quality</h2>
      <p>Poor sleep disrupts hunger hormones and metabolism. Aim for 7-9 hours of quality sleep per night.</p>
      
      <h2>Consider Intermittent Fasting</h2>
      <p>Time-restricted eating patterns may help break through plateaus by improving metabolic flexibility.</p>
      
      <h2>Be Patient</h2>
      <p>Weight loss isn't linear. Sometimes your body is changing composition (losing fat, gaining muscle) even when the scale doesn't move.</p>
      
      <p>Remember that plateaus are temporary. With strategic adjustments and persistence, you can overcome this common challenge and continue progressing toward your goals.</p>
    `,
  },
  "meal-plan-benefits": {
    title: "The Benefits of Customized Meal Plans",
    excerpt: "How personalized nutrition can transform your health, energy levels, and fitness results.",
    date: "April 8, 2025",
    author: "Amina Chaoui",
    image: "/blog-custom-meals.png",
    category: "Meal Plans",
    readTime: "4 min read",
    content: `
      <p>Customized meal plans offer significant advantages over generic diets. Here's how personalized nutrition can enhance your health and fitness journey:</p>
      
      <h2>Tailored to Your Unique Needs</h2>
      <p>Everyone has different nutritional requirements based on age, gender, activity level, health conditions, and goals. Customized meal plans account for these individual factors.</p>
      
      <h2>Optimized Macronutrient Balance</h2>
      <p>The ideal ratio of proteins, carbohydrates, and fats varies depending on your fitness goals. A personalized plan ensures you get the right balance for your specific objectives.</p>
      
      <h2>Accommodates Dietary Restrictions</h2>
      <p>Whether you have food allergies, intolerances, or follow specific diets like vegetarian or keto, customized plans work within your dietary parameters while maximizing nutrition.</p>
      
      <h2>Eliminates Decision Fatigue</h2>
      <p>Having your meals planned reduces the mental energy spent deciding what to eat, which can lead to better food choices and consistency.</p>
      
      <h2>Supports Specific Goals</h2>
      <p>Whether you're training for an athletic event, trying to lose weight, or managing a health condition, personalized meal plans target your specific objectives.</p>
      
      <h2>Reduces Food Waste</h2>
      <p>With proper planning, you buy only what you need, reducing unnecessary food purchases and waste.</p>
      
      <h2>Saves Time and Money</h2>
      <p>Structured meal plans streamline grocery shopping and meal preparation, saving both time and money in the long run.</p>
      
      <h2>Provides Education</h2>
      <p>Following a customized plan helps you learn about proper portion sizes, balanced nutrition, and how different foods affect your body.</p>
      
      <p>At Fitnest.ma, our nutrition experts create personalized meal plans that consider your preferences, lifestyle, and goals, making healthy eating sustainable and enjoyable for the long term.</p>
    `,
  },
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug as keyof typeof blogPosts]

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog">
          <Button variant="ghost" className="mb-6 text-logo-green hover:text-logo-green/80">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blog
          </Button>
        </Link>

        <div className="mb-6">
          <span className="inline-block px-3 py-1 text-sm font-semibold bg-logo-green/10 text-logo-green rounded-full mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

          <div className="flex items-center text-gray-600 mb-6">
            <div className="flex items-center mr-6">
              <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
              <span>{post.author}</span>
            </div>
            <span className="mr-6">{post.date}</span>
            <span>{post.readTime}</span>
          </div>
        </div>

        <div className="relative h-80 mb-8 rounded-lg overflow-hidden">
          <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
        </div>

        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }}></div>

        <div className="border-t border-gray-200 mt-12 pt-8">
          <h3 className="text-xl font-bold mb-4">Share this article</h3>
          <div className="flex space-x-4">
            <Button variant="outline" size="sm" className="rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="mr-2"
                viewBox="0 0 16 16"
              >
                <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
              </svg>
              Twitter
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="mr-2"
                viewBox="0 0 16 16"
              >
                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
              </svg>
              Facebook
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="mr-2"
                viewBox="0 0 16 16"
              >
                <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
              </svg>
              LinkedIn
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
