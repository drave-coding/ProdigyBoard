import { UserButton ,ClerkLoaded,ClerkLoading } from "@clerk/nextjs"
import { HeaderLogo } from "./HeaderLogo"
import Navigation from "./Navigation"
import { Loader2 } from "lucide-react"


const Header = () => {
  return (
    <header className="bg-slate-50 px-4 py-8 lg:px-8 pb-1 pt-4">
        <div className="max-w-screen-2xl mx-auto">
            <div className="w-full flex items-center justify-between mb-2">
                <div className="flex items-center lg:gap-x-16">
                    <HeaderLogo/>
                    <Navigation/>
                </div>
                
                <ClerkLoaded>
                    <UserButton showName afterSignOutUrl="/"/>
                </ClerkLoaded>
                
                
                <ClerkLoading>
                    <Loader2 className="size-8 animate-spin text-slate-400"/>
                </ClerkLoading>
                
            </div>
        </div>
    </header>
  )
}

export default Header