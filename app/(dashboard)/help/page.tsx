'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'

export default function HelpSupport() {
  return (
    <div className="min-h-screen bg-[#521D5C] flex flex-col">
      {/* Header */}
      {/* <header className="p-6">
        <h1 className="text-white text-3xl font-semibold pl-16">Help & Support</h1>
      </header> */}

      {/* Main Content */}
      <main className="flex-grow flex items-start justify-center px-4 pt-4 pb-16">
        <div className="bg-white rounded-3xl shadow-lg p-16 w-full max-w-5xl" style={{ height: '75vh' }}>
          <div className="h-full flex flex-col justify-center">
            <div className="text-center space-y-16">
              <h2 className="text-5xl font-bold text-gray-900">
                How can we help?
              </h2>

              {/* Main search form */}
              <form className="flex gap-4 max-w-3xl mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-6 w-6" />
                  <Input
                    type="search"
                    placeholder="Search for help..."
                    className="w-full pl-12 py-7 text-xl rounded-full bg-white border-gray-200"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="px-10 py-6 text-xl rounded-full bg-[#BE19F7] hover:bg-[#BE19F7]/90"
                >
                  Search
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}