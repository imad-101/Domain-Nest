import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Globe, Shield, Search, BarChart3, Bell, Zap } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white px-4 py-20">
      <div className="mx-auto max-w-4xl">
      

        {/* Features Card */}
        <div className="relative mb-12">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-green-400 via-blue-400 via-pink-400 via-purple-400 to-yellow-400 opacity-30 blur-xl"></div>
          <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-green-300 via-blue-300 via-pink-300 via-purple-300 to-yellow-300 opacity-40 blur-lg"></div>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-300 via-blue-300 via-pink-300 via-purple-300 to-yellow-300 p-1 opacity-60"></div>
          <Card className="relative rounded-2xl bg-white p-12 shadow-sm">
            <div className="grid gap-12 md:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-10">
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex size-8 items-center justify-center">
                    <Globe className="size-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl text-gray-900">Domain Management</h3>
                    <p className="text-gray-500">Manage unlimited domains effortlessly</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 flex size-8 items-center justify-center">
                    <Shield className="size-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl text-gray-900">SSL Monitoring</h3>
                    <p className="text-gray-500">Automatic SSL certificate tracking</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 flex size-8 items-center justify-center">
                    <Search className="size-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl text-gray-900">WHOIS Lookup</h3>
                    <p className="text-gray-500">Instant domain information retrieval</p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-10">
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex size-8 items-center justify-center">
                    <BarChart3 className="size-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl text-gray-900">Analytics Dashboard</h3>
                    <p className="text-gray-500">Track domain performance metrics</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 flex size-8 items-center justify-center">
                    <Bell className="size-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl text-gray-900">Expiry Alerts</h3>
                    <p className="text-gray-500">Never miss domain renewal dates</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 flex size-8 items-center justify-center">
                    <Zap className="size-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl text-gray-900">Bulk Operations</h3>
                    <p className="text-gray-500">Manage multiple domains at once</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* All features text */}
        <div className="mb-16 text-center">
          <p className="text-lg text-gray-500">All our features are available to all users</p>
        </div>

        {/* Pricing */}
        <div className="text-center">
          <div className="mb-10 flex items-baseline justify-center gap-1">
            <span className="text-3xl text-gray-400">$</span>
            <span className="text-8xl text-gray-900">49</span>
            <span className="text-2xl text-gray-400">lifetime</span>
          </div>

          <Button size="lg" className="mb-6 rounded-xl bg-gray-900 px-10 py-4 text-lg text-white hover:bg-gray-800">
            Get lifetime access for $49
          </Button>

          <p className="text-gray-400">30 days money back guarantee</p>
        </div>
      </div>
    </div>
  )
}
