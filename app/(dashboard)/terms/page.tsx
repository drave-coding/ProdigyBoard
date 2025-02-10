
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"


export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-[#521D5C] p-4 md:p-6 lg:p-8">
      <div className="container max-w-4xl mx-auto space-y-4">
        <h1 className="text-2xl font-semibold text-white">Terms & Conditions</h1>
        <Card className="p-6">
          <CardContent className="space-y-4 text-[15px] leading-relaxed">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.
            </p>
            <p>
              Curabitur tempor quis eros tempus lacinia. Nam bibendum pellentesque quam a convallis. Sed ut vulputate nisi. Integer in felis sed leo vestibulum venenatis. Suspendisse quis arcu sem. Aenean feugiat ex eu vestibulum vestibulum. Morbi a eleifend magna. Nam metus lacus, porttitor eu mauris a, blandit ultrices nibh. Mauris sit amet magna non ligula vestibulum eleifend. Nulla varius volutpat turpis sed lacinia. Nam eget mi in purus lobortis eleifend. Sed nec ante dictum sem condimentum ullamcorper quis venenatis nisi. Proin vitae facilisis nisi, ac posuere leo.
            </p>
            <p>
              Nam pulvinar blandit velit, id condimentum diam faucibus at. Aliquam lacus nisi, sollicitudin at nisi nec, fermentum congue felis. Quisque mauris dolor, fringilla sed tincidunt ac, finibus non odio. Sed vitae mauris nec ante pretium finibus. Donec nisl neque, pharetra ac elit eu, faucibus aliquam ligula.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              className="bg-[#521D5C] hover:bg-[#521D5C] text-white"
              size="lg"
            >
              Agree
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}