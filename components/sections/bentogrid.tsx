export default function BentoGrid() {
  return (
    <section className="py-32">
       <div className="flex flex-col justify-start items-center gap-4 mb-10">
          <h2 className="w-full max-w-[435px] text-center text-foreground text-4xl font-semibold leading-10 break-words">
    Features
          </h2>
          <p className="self-stretch text-center text-muted-foreground text-sm font-medium leading-[18.20px] break-words">
            Explore the powerful features that make our platform stand out.
          </p>
        </div>
      <div className="mx-auto w-full max-w-screen-xl px-4 md:px-8">
        <div className="relative z-10 grid grid-cols-6 gap-4">
          {/* First card */}
          <div className="group relative col-span-full bg-white flex overflow-hidden rounded-3xl border border-border/50  p-8 transition-all duration-300 lg:col-span-2">
            <div className="absolute inset-0  " />
            <div className="relative m-auto size-fit">
              <div className="relative flex h-24 w-56 items-center">
                <svg
                  className="absolute inset-0 size-full text-secondary/20 transition-colors duration-300 group-hover:text-secondary/30"
                  viewBox="0 0 254 104"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M112.891 97.7022C140.366 97.0802 171.004 94.6715 201.087 87.5116C210.43 85.2881 219.615 82.6412 228.284 78.2473C232.198 76.3179 235.905 73.9942 239.348 71.3124C241.85 69.2557 243.954 66.7571 245.555 63.9408C249.34 57.3235 248.281 50.5341 242.498 45.6109C239.033 42.7237 235.228 40.2703 231.169 38.3054C219.443 32.7209 207.141 28.4382 194.482 25.534C184.013 23.1927 173.358 21.7755 162.64 21.2989C161.376 21.3512 160.113 21.181 158.908 20.796C158.034 20.399 156.857 19.1682 156.962 18.4535C157.115 17.8927 157.381 17.3689 157.743 16.9139C158.104 16.4588 158.555 16.0821 159.067 15.8066C160.14 15.4683 161.274 15.3733 162.389 15.5286C179.805 15.3566 196.626 18.8373 212.998 24.462C220.978 27.2494 228.798 30.4747 236.423 34.1232C240.476 36.1159 244.202 38.7131 247.474 41.8258C254.342 48.2578 255.745 56.9397 251.841 65.4892C249.793 69.8582 246.736 73.6777 242.921 76.6327C236.224 82.0192 228.522 85.4602 220.502 88.2924C205.017 93.7847 188.964 96.9081 172.738 99.2109C153.442 101.949 133.993 103.478 114.506 103.79C91.1468 104.161 67.9334 102.97 45.1169 97.5831C36.0094 95.5616 27.2626 92.1655 19.1771 87.5116C13.839 84.5746 9.1557 80.5802 5.41318 75.7725C-0.54238 67.7259 -1.13794 59.1763 3.25594 50.2827C5.82447 45.3918 9.29572 41.0315 13.4863 37.4319C24.2989 27.5721 37.0438 20.9681 50.5431 15.7272C68.1451 8.8849 86.4883 5.1395 105.175 2.83669C129.045 0.0992292 153.151 0.134761 177.013 2.94256C197.672 5.23215 218.04 9.01724 237.588 16.3889C240.089 17.3418 242.498 18.5197 244.933 19.6446C246.627 20.4387 247.725 21.6695 246.997 23.615C246.455 25.1105 244.814 25.5605 242.63 24.5811C230.322 18.9961 217.233 16.1904 204.117 13.4376C188.761 10.3438 173.2 8.36665 157.558 7.52174C129.914 5.70776 102.154 8.06792 75.2124 14.5228C60.6177 17.8788 46.5758 23.2977 33.5102 30.6161C26.6595 34.3329 20.4123 39.0673 14.9818 44.658C12.9433 46.8071 11.1336 49.1622 9.58207 51.6855C4.87056 59.5336 5.61172 67.2494 11.9246 73.7608C15.2064 77.0494 18.8775 79.925 22.8564 82.3236C31.6176 87.7101 41.3848 90.5291 51.3902 92.5804C70.6068 96.5773 90.0219 97.7419 112.891 97.7022Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="mx-auto block w-fit bg-gradient-to-r from-secondary via-secondary to-chart-1 bg-clip-text font-heading text-5xl font-bold text-transparent transition-all duration-300 group-hover:scale-105">
                  500+
                </span>
              </div>
              <h2 className="mt-6 text-center font-heading text-3xl font-semibold text-foreground md:text-4xl lg:text-[40px]">
                Domains Managed
              </h2>
              <p className="mt-2 text-center text-sm text-muted-foreground">Trusted by businesses worldwide</p>
            </div>
          </div>

          {/* Second card */}
          <div className="group relative col-span-full overflow-hidden rounded-3xl border border-border/50 bg-white p-8 transition-all duration-300 sm:col-span-3 lg:col-span-2">
            <div className="absolute inset-0 bg-gradient-to-br from-chart-2/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative">
              <div className="relative mx-auto flex aspect-square size-32 rounded-full border border-chart-2/20 bg-gradient-to-br from-chart-2/10 to-chart-2/5 before:absolute before:-inset-2 before:rounded-full before:border before:border-chart-2/10 before:bg-chart-2/5 transition-all duration-300 group-hover:scale-105 group-hover:before:border-chart-2/20">
                <svg
                  className="m-auto h-fit w-16 text-secondary transition-all duration-300 group-hover:text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div className="relative z-10 mt-8 space-y-2 text-center">
                <h2 className="text-xl font-semibold text-foreground transition-colors duration-300 group-hover:text-chart-2">
                  24/7 SSL Monitoring
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Automatic SSL certificate monitoring and renewal alerts. Never lose visitors due to expired
                  certificates.
                </p>
              </div>
            </div>
          </div>

          {/* Third card */}
          <div className="group relative col-span-full overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-background to-chart-3/5 p-8 transition-all duration-300 hover:opacity-100 sm:col-span-3 lg:col-span-2">
            <div className="absolute inset-0 bg-white  duration-300 group-hover:opacity-100" />
            <div className="relative">
              <div className="transition-transform duration-300 group-hover:scale-105">
                <div className="relative mx-auto flex aspect-square size-32 rounded-full border border-chart-3/20 bg-gradient-to-br from-chart-3/10 to-chart-3/5 before:absolute before:-inset-2 before:rounded-full before:border before:border-chart-3/10 before:bg-chart-3/5">
                  <svg
                    className="m-auto h-fit w-16 text-secondary transition-all duration-300 group-hover:text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="relative z-10 mt-8 space-y-2 text-center">
                <h2 className="text-xl font-semibold text-foreground transition-colors duration-300 group-hover:text-chart-3">
                  Instant DNS Management
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Manage DNS records across all providers from one dashboard. Updates propagate globally in seconds.
                </p>
              </div>
            </div>
          </div>

          {/* Fourth card */}
          <div className="group relative col-span-full overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-background to-chart-4/5 p-8 transition-all duration-300 lg:col-span-3">
            <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="grid sm:grid-cols-2">
              <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                <div className="relative flex aspect-square size-12 rounded-full border border-chart-4/20 bg-gradient-to-br from-chart-4/10 to-chart-4/5 before:absolute before:-inset-2 before:rounded-full before:border before:border-chart-4/10 before:bg-chart-4/5 transition-all duration-300 group-hover:scale-105">
                  <svg
                    className="m-auto size-6 text-secondary transition-all duration-300 group-hover:text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-foreground transition-colors duration-300 group-hover:text-chart-4">
                    Renewal & Expiry Alerts
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Never lose a domain again. Smart alerts 90, 30, and 7 days before expiration with one-click renewal.
                  </p>
                </div>
              </div>
              <div className="relative -mb-10 -mr-10 mt-8 h-fit rounded-tl-xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 pt-6 transition-all duration-300 group-hover:border-chart-4/20 sm:ml-6 sm:mt-auto">
                <div className="absolute left-3 top-2 flex gap-1">
                  <span className="block size-2 rounded-full border border-chart-4/30 bg-chart-4/20"></span>
                  <span className="block size-2 rounded-full border border-chart-4/30 bg-chart-4/20"></span>
                  <span className="block size-2 rounded-full border border-chart-4/30 bg-chart-4/20"></span>
                </div>
                <div className="h-32 w-full overflow-hidden px-4 pb-4">
                  <div className="h-full w-full rounded-lg flex flex-col justify-center space-y-3">
                    {/* Calendar-like grid for renewal dates */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Renewal Alerts</span>
                      <div className="flex space-x-1">
                        <div className="w-4 h-4 rounded-sm bg-red-500/80 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                        </div>
                        <div className="w-4 h-4 rounded-sm bg-yellow-500/80 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                        </div>
                        <div className="w-4 h-4 rounded-sm bg-green-500/80 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {[...Array(21)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-3 h-3 rounded-sm ${
                            i === 2 ? 'bg-red-500/60' : 
                            i === 9 ? 'bg-yellow-500/60' : 
                            i === 16 ? 'bg-green-500/60' : 
                            'bg-chart-4/20'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fifth card */}
          <div className="group relative col-span-full overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-background to-chart-5/5 p-8 transition-all duration-300 lg:col-span-3">
            <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="grid h-full sm:grid-cols-2">
              <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                <div className="relative flex aspect-square size-12 rounded-full border border-chart-5/20 bg-gradient-to-br from-chart-5/10 to-chart-5/5 before:absolute before:-inset-2 before:rounded-full before:border before:border-chart-5/10 before:bg-chart-5/5 transition-all duration-300 group-hover:scale-105">
                  <svg
                    className="m-auto size-6 text-secondary transition-all duration-300 group-hover:text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-foreground transition-colors duration-300 group-hover:text-chart-5">
                    Domain Health & Analytics
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Real-time monitoring of domain performance, uptime, and security metrics with detailed analytics.
                  </p>
                </div>
              </div>
              <div className="relative mt-6 sm:-my-8 sm:-mr-8">
                <div className="relative flex h-full flex-col justify-center space-y-4 py-6 px-4">
                  {/* Health Status Indicators */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Domain Status</span>
                    <div className="flex space-x-2">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-xs text-green-600">Online</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <span className="text-xs text-yellow-600">Warning</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Analytics Chart */}
                  <div className="relative h-24 w-full rounded-lg border border-chart-5/20 bg-gradient-to-r from-chart-5/10 to-transparent p-3">
                    <div className="flex h-full items-end justify-between space-x-1">
                      <div className="w-3 h-16 bg-gradient-to-t from-chart-5/60 to-chart-5/40 rounded-sm"></div>
                      <div className="w-3 h-12 bg-gradient-to-t from-green-500/60 to-green-500/40 rounded-sm"></div>
                      <div className="w-3 h-18 bg-gradient-to-t from-chart-5/60 to-chart-5/40 rounded-sm"></div>
                      <div className="w-3 h-8 bg-gradient-to-t from-yellow-500/60 to-yellow-500/40 rounded-sm"></div>
                      <div className="w-3 h-14 bg-gradient-to-t from-chart-5/60 to-chart-5/40 rounded-sm"></div>
                      <div className="w-3 h-10 bg-gradient-to-t from-green-500/60 to-green-500/40 rounded-sm"></div>
                    </div>
                    {/* Overlay metrics */}
                    <div className="absolute top-1 right-1 text-xs text-chart-5/80">99.9%</div>
                  </div>
                  
                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-md border border-chart-5/20 bg-gradient-to-r from-chart-5/5 to-transparent p-2">
                      <div className="text-xs text-muted-foreground">Response Time</div>
                      <div className="text-sm font-medium text-green-600">124ms</div>
                    </div>
                    <div className="rounded-md border border-chart-5/20 bg-gradient-to-r from-chart-5/5 to-transparent p-2">
                      <div className="text-xs text-muted-foreground">Uptime</div>
                      <div className="text-sm font-medium text-chart-5">99.9%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
