"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function UserContribution() {
  const handleContribute = () => {
    console.log("Contribute button clicked")
  }

  return (
    <div className="min-h-screen bg-[#521D5C] p-4 md:p-6 lg:p-8">
      <div className="container max-w-4xl mx-auto space-y-4">
        <h1 className="text-2xl font-semibold text-white">User Contribution</h1>
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Contribute to the Company
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center pt-24 pb-32">
            <Button
              onClick={handleContribute}
              className="bg-[#521D5C] hover:bg-[#521D5C] text-white px-6"
              size="lg"
            >
              contribute +
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}