import { Button } from "@/components/ui/button"

export default function CallToActionSection() {
  return (
    <section className="py-0 mb-12 md:mb-24 px-4 md:px-0">
      <div className="bg-gray-950 rounded-[2rem] md:rounded-[3rem] relative overflow-hidden min-h-[400px] md:min-h-[580px] max-w-6xl mx-auto">
        {/* Massive Domnest background text */}
        <div className="absolute inset-0 flex items-end justify-center pb-8 md:mt-96 md:pb-0 md:items-center">
          <span className="text-[6rem] md:text-[12rem] lg:text-[12rem] xl:text-[18rem]  text-white leading-none opacity-10 md:opacity-100">
            Domnest
          </span>
        </div>

        <div className="relative z-10 px-6 md:px-8 py-8 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Left Content */}
            <div className="text-white">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 leading-tight">
                Manage all your domains
                <br />
                under one dashboard
              </h2>
              <p className="text-gray-300 text-sm md:text-base mb-6 md:mb-8 leading-relaxed">
                Take control of your domain portfolio
                <br />
                with powerful management tools,
                <br />
                renewal tracking, and DNS control.
              </p>
              <Button className="bg-[#ff4f01] hover:bg-[#e04501] text-white px-6 md:px-8 py-3 md:py-4 lg:py-6 rounded-full text-sm md:text-base lg:text-lg font-semibold w-full md:w-auto">
                Start Managing Domains
              </Button>
            </div>

            {/* Right Content - Link Columns */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 lg:gap-8 text-white mt-6 md:mt-0">
              <div>
                <h3 className="text-sm md:text-lg lg:text-xl font-semibold mb-3 md:mb-4 lg:mb-6 text-white">Features</h3>
                <div className="space-y-2 md:space-y-3 lg:space-y-4">
                  <a href="#features" className="block text-gray-300 hover:text-white transition-colors text-xs md:text-sm lg:text-base">
                    Domain Search
                  </a>
                  <a href="#features" className="block text-gray-300 hover:text-white transition-colors text-xs md:text-sm lg:text-base">
                    DNS Management
                  </a>
                  <a href="#features" className="block text-gray-300 hover:text-white transition-colors text-xs md:text-sm lg:text-base">
                    Auto Renewal
                  </a>
                  <a href="#pricing" className="block text-gray-300 hover:text-white transition-colors text-xs md:text-sm lg:text-base">
                    Pricing
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-sm md:text-lg lg:text-xl font-semibold mb-3 md:mb-4 lg:mb-6 text-white">Connect</h3>
                <div className="space-y-2 md:space-y-3 lg:space-y-4">
                  <a href="#" className="block text-gray-300 hover:text-white transition-colors text-xs md:text-sm lg:text-base">
                    Twitter
                  </a>
                  <a href="#" className="block text-gray-300 hover:text-white transition-colors text-xs md:text-sm lg:text-base">
                    GitHub
                  </a>
                  <a href="#" className="block text-gray-300 hover:text-white transition-colors text-xs md:text-sm lg:text-base">
                    Discord
                  </a>
                  <a href="#" className="block text-gray-300 hover:text-white transition-colors text-xs md:text-sm lg:text-base">
                    LinkedIn
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-sm md:text-lg lg:text-xl font-semibold mb-3 md:mb-4 lg:mb-6 text-white">Support</h3>
                <div className="space-y-2 md:space-y-3 lg:space-y-4">
                  <a href="#" className="block text-gray-300 hover:text-white transition-colors text-xs md:text-sm lg:text-base">
                    Help Center
                  </a>
                  <a href="#" className="block text-gray-300 hover:text-white transition-colors text-xs md:text-sm lg:text-base">
                    Privacy
                  </a>
                  <a href="#" className="block text-gray-300 hover:text-white transition-colors text-xs md:text-sm lg:text-base">
                    Terms
                  </a>
                  <a href="#" className="block text-gray-300 hover:text-white transition-colors text-xs md:text-sm lg:text-base">
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}