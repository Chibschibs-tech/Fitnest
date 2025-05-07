import Image from "next/image"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">About Fitnest</h1>

      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
        <p className="mb-6 text-gray-700">
          At Fitnest, we envision a world where healthy eating is accessible, enjoyable, and sustainable for everyone.
          We believe that good nutrition is the foundation of a healthy lifestyle, and we're committed to making it
          easier for people to nourish their bodies with delicious, nutrient-rich meals.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="mb-6 text-gray-700">
          Our mission is to empower individuals to take control of their health through proper nutrition. We do this by
          providing personalized meal plans, delivering fresh, chef-prepared meals, and offering ongoing support and
          education. We're dedicated to making healthy eating simple, convenient, and enjoyable.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Quality</h3>
            <p className="text-gray-700">
              We never compromise on the quality of our ingredients or meals. We source the freshest, most nutritious
              ingredients and prepare them with care to ensure every meal is delicious and healthy.
            </p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Personalization</h3>
            <p className="text-gray-700">
              We understand that everyone's nutritional needs and preferences are different. That's why we offer
              personalized meal plans tailored to individual goals, tastes, and dietary requirements.
            </p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
            <p className="text-gray-700">
              We're committed to minimizing our environmental impact. From sourcing local ingredients to using
              eco-friendly packaging, we strive to make sustainable choices at every step.
            </p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Education</h3>
            <p className="text-gray-700">
              We believe in empowering our customers with knowledge about nutrition and healthy eating. We provide
              resources and support to help them make informed choices about their diet.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
        <p className="mb-6 text-gray-700">
          Fitnest was founded in 2022 by a team of nutrition experts, chefs, and fitness enthusiasts who shared a
          passion for healthy eating and a vision for making it more accessible. What started as a small meal prep
          service has grown into a comprehensive nutrition solution that helps thousands of people achieve their health
          and fitness goals.
        </p>
      </div>

      <div className="bg-green-50 p-8 rounded-lg mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Our Team</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden">
              <Image
                src="/professional-chef-portrait.png"
                alt="Chef Portrait"
                width={160}
                height={160}
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">Chef Karim</h3>
            <p className="text-gray-600">Head Chef</p>
          </div>

          <div className="text-center">
            <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden">
              <Image
                src="/placeholder.svg?key=5b98g"
                alt="Nutritionist Portrait"
                width={160}
                height={160}
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">Dr. Amina</h3>
            <p className="text-gray-600">Lead Nutritionist</p>
          </div>

          <div className="text-center">
            <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden">
              <Image
                src="/placeholder.svg?key=5cve8"
                alt="Fitness Coach Portrait"
                width={160}
                height={160}
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">Coach Youssef</h3>
            <p className="text-gray-600">Fitness Consultant</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-6">Ready to Start Your Healthy Journey?</h2>
        <Link
          href="/meal-plans"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Explore Our Meal Plans
        </Link>
      </div>
    </div>
  )
}
