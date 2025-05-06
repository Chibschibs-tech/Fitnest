import type { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "About Us | Fitnest",
  description:
    "Learn about Fitnest, Morocco's premier meal prep delivery service dedicated to helping you achieve your health and fitness goals.",
}

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <section className="mb-16">
        <h1 className="text-4xl font-bold mb-6 text-center">About Fitnest</h1>
        <div className="max-w-3xl mx-auto">
          <p className="text-lg mb-6">
            Fitnest is Morocco's premier meal prep delivery service dedicated to helping you achieve your health and
            fitness goals through delicious, nutritionally balanced meals delivered right to your door.
          </p>
          <p className="text-lg mb-6">
            Founded in 2023, we started with a simple mission: to make healthy eating convenient, delicious, and
            accessible for everyone in Morocco.
          </p>
        </div>
      </section>

      <section className="mb-16 bg-gray-50 py-12 rounded-lg">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Mission</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg mb-4">
                At Fitnest, we believe that good nutrition should be accessible to everyone. Our mission is to empower
                people to live healthier lives by providing convenient, delicious, and nutritionally balanced meals.
              </p>
              <p className="text-lg">
                We're committed to using fresh, high-quality ingredients to create meals that not only support your
                health and fitness goals but also delight your taste buds.
              </p>
            </div>
            <div className="relative h-80 rounded-lg overflow-hidden">
              <Image src="/placeholder.svg?key=toven" alt="Fitnest kitchen" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-green-600">Quality</h3>
            <p>
              We never compromise on the quality of our ingredients or meals. Every dish is prepared with care using
              fresh, high-quality ingredients.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-green-600">Nutrition</h3>
            <p>
              Our meals are designed by nutrition experts to provide balanced nutrition that supports your health and
              fitness goals.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-green-600">Convenience</h3>
            <p>
              We believe healthy eating should be easy. Our delivery service brings nutritious meals right to your door,
              saving you time and effort.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
              <Image src="/professional-chef-portrait.png" alt="Executive Chef" fill className="object-cover" />
            </div>
            <h3 className="text-xl font-semibold">Karim Benali</h3>
            <p className="text-green-600">Executive Chef</p>
          </div>
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
              <Image src="/placeholder.svg?key=c89xy" alt="Head Nutritionist" fill className="object-cover" />
            </div>
            <h3 className="text-xl font-semibold">Leila Tazi</h3>
            <p className="text-green-600">Head Nutritionist</p>
          </div>
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
              <Image src="/placeholder.svg?key=dukkd" alt="Founder & CEO" fill className="object-cover" />
            </div>
            <h3 className="text-xl font-semibold">Omar Alaoui</h3>
            <p className="text-green-600">Founder & CEO</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Join Us on Our Mission</h2>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg mb-6">
            Whether you're looking to lose weight, build muscle, or simply maintain a healthy lifestyle, Fitnest is here
            to support your journey with delicious, nutritious meals delivered right to your door.
          </p>
          <a
            href="/order"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
          >
            Start Your Journey Today
          </a>
        </div>
      </section>
    </main>
  )
}
