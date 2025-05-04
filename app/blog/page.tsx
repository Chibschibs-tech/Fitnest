import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function BlogPage() {
  const blogPosts = [
    {
      id: "healthy-meal-prep",
      title: "10 Healthy Meal Prep Tips for Busy Professionals",
      excerpt: "Learn how to efficiently prepare nutritious meals for the entire week, even with a busy schedule.",
      date: "May 2, 2025",
      author: "Nadia Benali",
      image: "/blog-meal-prep.png",
      category: "Meal Prep",
      readTime: "5 min read",
    },
    {
      id: "nutrition-myths",
      title: "5 Common Nutrition Myths Debunked",
      excerpt: "Separating fact from fiction: nutrition experts weigh in on popular diet claims and misconceptions.",
      date: "April 28, 2025",
      author: "Dr. Karim Alaoui",
      image: "/blog-nutrition-myths.png",
      category: "Nutrition",
      readTime: "7 min read",
    },
    {
      id: "protein-sources",
      title: "Best Plant-Based Protein Sources for Vegetarians",
      excerpt: "Discover delicious and protein-rich plant foods that can help you meet your fitness goals.",
      date: "April 21, 2025",
      author: "Leila Tazi",
      image: "/blog-plant-protein.png",
      category: "Nutrition",
      readTime: "6 min read",
    },
    {
      id: "weight-loss-plateau",
      title: "Breaking Through a Weight Loss Plateau",
      excerpt: "Effective strategies to overcome stalled progress and continue your weight loss journey.",
      date: "April 15, 2025",
      author: "Youssef Mansouri",
      image: "/blog-weight-loss.png",
      category: "Fitness",
      readTime: "8 min read",
    },
    {
      id: "meal-plan-benefits",
      title: "The Benefits of Customized Meal Plans",
      excerpt: "How personalized nutrition can transform your health, energy levels, and fitness results.",
      date: "April 8, 2025",
      author: "Amina Chaoui",
      image: "/blog-custom-meals.png",
      category: "Meal Plans",
      readTime: "4 min read",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Fitnest.ma Blog</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Expert advice on nutrition, fitness, and healthy living to help you achieve your wellness goals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:shadow-lg"
          >
            <div className="relative h-48">
              <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold px-2 py-1 bg-logo-green/10 text-logo-green rounded-full">
                  {post.category}
                </span>
                <span className="text-xs text-gray-500">{post.readTime}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{post.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 mr-2"></div>
                  <span className="text-sm text-gray-700">{post.author}</span>
                </div>
                <span className="text-sm text-gray-500">{post.date}</span>
              </div>
              <div className="mt-4">
                <Link href={`/blog/${post.id}`}>
                  <Button
                    variant="outline"
                    className="w-full border-logo-green text-logo-green hover:bg-logo-green hover:text-white"
                  >
                    Read More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
