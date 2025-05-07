import { Mail, MapPin, Phone } from "lucide-react"
import { siteConfig } from "@/lib/constants"

export function ContactInfo() {
  return (
    <div className="space-y-6">
      <div className="flex items-start">
        <MapPin className="h-6 w-6 text-green-600 mr-3 mt-1" />
        <div>
          <h3 className="font-medium">Address</h3>
          <p className="text-gray-600">123 Nutrition Street, Casablanca, Morocco</p>
        </div>
      </div>

      <div className="flex items-start">
        <Mail className="h-6 w-6 text-green-600 mr-3 mt-1" />
        <div>
          <h3 className="font-medium">Email</h3>
          <a href={`mailto:${siteConfig.contactEmail}`} className="text-gray-600 hover:text-green-600">
            {siteConfig.contactEmail}
          </a>
        </div>
      </div>

      <div className="flex items-start">
        <Phone className="h-6 w-6 text-green-600 mr-3 mt-1" />
        <div>
          <h3 className="font-medium">Phone</h3>
          <a href="tel:+212522123456" className="text-gray-600 hover:text-green-600">
            +212 522 123 456
          </a>
        </div>
      </div>
    </div>
  )
}
