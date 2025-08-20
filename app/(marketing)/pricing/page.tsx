import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Globe, Shield, Search, BarChart3, Bell, Zap } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
      

        {/* Features Card */}
        <div className="relative mb-12">
          <div className="absolute -inset-4 bg-gradient-to-r from-green-400 via-blue-400 via-purple-400 via-pink-400 to-yellow-400 rounded-3xl blur-xl opacity-30"></div>
          <div className="absolute -inset-2 bg-gradient-to-r from-green-300 via-blue-300 via-purple-300 via-pink-300 to-yellow-300 rounded-2xl blur-lg opacity-40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-green-300 via-blue-300 via-purple-300 via-pink-300 to-yellow-300 rounded-2xl p-1 opacity-60"></div>
          <Card className="relative bg-white rounded-2xl p-12 shadow-sm">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Left Column */}
              <div className="space-y-10">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 flex items-center justify-center mt-1">
                    <Globe className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-xl text-gray-900 mb-2">Domain Management</h3>
                    <p className="text-gray-500">Manage unlimited domains effortlessly</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 flex items-center justify-center mt-1">
                    <Shield className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-xl text-gray-900 mb-2">SSL Monitoring</h3>
                    <p className="text-gray-500">Automatic SSL certificate tracking</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 flex items-center justify-center mt-1">
                    <Search className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-xl text-gray-900 mb-2">WHOIS Lookup</h3>
                    <p className="text-gray-500">Instant domain information retrieval</p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-10">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 flex items-center justify-center mt-1">
                    <BarChart3 className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-xl text-gray-900 mb-2">Analytics Dashboard</h3>
                    <p className="text-gray-500">Track domain performance metrics</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 flex items-center justify-center mt-1">
                    <Bell className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-xl text-gray-900 mb-2">Expiry Alerts</h3>
                    <p className="text-gray-500">Never miss domain renewal dates</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 flex items-center justify-center mt-1">
                    <Zap className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-xl text-gray-900 mb-2">Bulk Operations</h3>
                    <p className="text-gray-500">Manage multiple domains at once</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* All features text */}
        <div className="text-center mb-16">
          <p className="text-gray-500 text-lg">All our features are available to all users</p>
        </div>

        {/* Pricing */}
        <div className="text-center">
          <div className="flex items-baseline justify-center gap-1 mb-10">
            <span className="text-gray-400 text-3xl">$</span>
            <span className="text-8xl text-gray-900">49</span>
            <span className="text-gray-400 text-2xl">lifetime</span>
          </div>

          <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-10 py-4 text-lg rounded-xl mb-6">
            Get lifetime access for $49
          </Button>

          <p className="text-gray-400">30 days money back guarantee</p>
        </div>
      </div>
    </div>
  )
}
