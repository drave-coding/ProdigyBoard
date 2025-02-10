'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#521D5C] p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Privacy and Policy</h1>
        <Card className="rounded-3xl">
          <CardContent className="p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Privacy</h2>
              <p className="text-gray-700">
                Because your privacy is important to us, we&apos;re transparent about how we collect, use, and share information
                about you.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Cookie preferences</h2>
              <p className="text-gray-700 mb-4">
                When you visit an Atlassian product, it may store or retrieve information from your browser, mostly in the
                form of cookies. This information may be about you, your preferences, or your device, and is mostly used to
                make the site work as you would expect. The information doesn&apos;t usually directly identify you, but it
                provides a more personalized web experience. We respect your right to privacy, so you can select which
                cookies you allow.{" "}
                <Link href="#" className="text-[#4C2A85] hover:underline">
                  Atlassian cookies and tracking notice
                </Link>
              </p>
              <Button
                variant="secondary"
                className="bg-gray-200 hover:bg-gray-300 text-gray-900"
                onClick={() => console.log("Open cookie preferences")}
              >
                Open cookie Preference
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}