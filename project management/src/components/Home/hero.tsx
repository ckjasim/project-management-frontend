import { BarChart2, FileText, Folder } from 'lucide-react'
import React from 'react'

const Hero = () => {
  return (
    <div>
       <div className="max-w-7xl mx-auto px-4 py-36">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div>
            <div className="text-sm text-indigo-600 font-medium mb-4">
              BEST SOFTWARE SERVICE
            </div>
            <h1 className="text-5xl font-bold mb-6">
              Create & analytics all necessaries
            </h1>
            <p className="text-gray-600 mb-8">
              Manage your all documents transparent, safe and secure. We provide world's
              best analytics solutions.
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors">
                Get Started
              </button>
              <button className="px-6 py-3 text-gray-600 hover:text-indigo-600 transition-colors">
                Explore More
              </button>
            </div>
          </div>

          {/* Right Column - Analytics Dashboard Illustration */}
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-50 rounded-3xl rotate-3 transform"></div>
            <div className="relative bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
              {/* Analytics Dashboard Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Stats Panel */}
                <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <BarChart2 className="w-5 h-5 text-indigo-600" />
                      <span className="font-medium">Analytics</span>
                    </div>
                    <button className="text-sm text-gray-500">View All</button>
                  </div>
                  <div className="h-32 flex items-end gap-2">
                    {[40, 70, 45, 80, 60, 75].map((height, i) => (
                      <div key={i} className="flex-1">
                        <div 
                          className="bg-indigo-600 rounded-t"
                          style={{ height: `${height}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Statistics Card */}
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <span className="font-medium">Statistics</span>
                  </div>
                  <div className="h-24">
                    <svg className="w-full h-full" viewBox="0 0 100 50">
                      <path
                        d="M0 40 Q 25 20 50 35 T 100 30"
                        fill="none"
                        stroke="#4f46e5"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>

                {/* Documents Card */}
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Folder className="w-5 h-5 text-indigo-600" />
                    <span className="font-medium">Documents</span>
                  </div>
                  <div className="text-2xl font-bold">154,380</div>
                </div>
              </div>

              {/* Connector Lines */}
              <div className="absolute -right-4 top-1/4 w-8 h-32 border-t-2 border-r-2 border-indigo-200 rounded-tr-xl"></div>
              <div className="absolute -left-4 bottom-1/4 w-8 h-32 border-b-2 border-l-2 border-indigo-200 rounded-bl-xl"></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Hero
