import { ContactForm } from "@/components/contact-form"
import { ContactInfo } from "@/components/contact-info"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Contact Us</h1>

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="p-8 bg-green-50">
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
            <p className="mb-6 text-gray-600">
              Have questions about our meal plans or services? We'd love to hear from you! Fill out the form and our
              team will get back to you as soon as possible.
            </p>
            <ContactInfo />
          </div>

          <div className="p-8">
            <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
            <ContactForm />
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Find Us</h2>
        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106376.72692390046!2d-7.669934242187499!3d33.57240999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7cd4778aa113b%3A0xb06c1d84f310fd3!2sCasablanca%2C%20Morocco!5e0!3m2!1sen!2sus!4v1620123456789!5m2!1sen!2sus"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Fitnest Location"
          ></iframe>
        </div>
      </div>
    </div>
  )
}
