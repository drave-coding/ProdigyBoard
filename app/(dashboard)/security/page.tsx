'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from 'lucide-react'
import { useState } from "react"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function SecuritySettings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)


  return (
    <div className="min-h-screen bg-[#521D5C] p-6 ">
      <div className=" mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-white mb-6">Security</h1>
        <ScrollArea className="h-[550px] overflow-y-auto">
        <Card className="overflow-hidden">
          <CardContent className="p-6 space-y-8">
            {/* Password Change Section */}
            <section>
              <h2 className="text-xl font-semibold mb-2">Change your password</h2>
              <p className="text-sm text-muted-foreground mb-4">
                When you change your password, we keep you logged in to this device but may log you out from your other
                devices.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm mb-2 block">
                    Current password<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter current password"
                      className="bg-muted pr-10"
                    
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm mb-2 block">
                    New password<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="bg-muted pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <Button className="bg-[#8E44AD] hover:bg-[#7D3C98] text-white">Save Changes</Button>
              </div>
            </section>

            {/* Two-step Verification Section */}
            <section>
              <h2 className="text-xl font-semibold mb-2">Two-step verification</h2>
              <p className="text-sm text-muted-foreground mb-2">
                Keep your account extra secure with a second login step.{" "}
                <Link href="#" className="text-[#8E44AD] hover:underline">
                  Learn more
                </Link>
              </p>
              <Link href="#" className="text-[#8E44AD] hover:underline text-sm">
                Manage two-step verification
              </Link>
            </section>

            {/* API Tokens Section */}
            <section>
              <h2 className="text-xl font-semibold mb-2">API tokens</h2>
              <p className="text-sm text-muted-foreground mb-2">
                A script or other process can use an API token to perform basic authentication with Jira Cloud applications or
                Confluence Cloud. You must use an API token if the Atlassian account you authenticate with has two-step
                verification enabled. You should treat API tokens as securely as any other password.{" "}
                <Link href="#" className="text-[#8E44AD] hover:underline">
                  Learn more
                </Link>
              </p>
              <Link href="#" className="text-[#8E44AD] hover:underline text-sm">
                Create and manage API tokens
              </Link>
            </section>

            {/* Recent Devices Section */}
            <section>
              <h2 className="text-xl font-semibold mb-2">Recent devices</h2>
              <p className="text-sm text-muted-foreground mb-2">
                If you&apos;ve lost one of your devices or notice any suspicious activity, log out of all your devices and take
                steps to secure your account. Learn more
              </p>
              <Link href="#" className="text-[#8E44AD] hover:underline text-sm">
                View and manage recent devices
              </Link>
            </section>
          </CardContent>
        </Card>
        </ScrollArea>
        
        </div>
        
      </div>
    
  )
}