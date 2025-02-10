import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";


type Props = {
    href: string;
    label:string;
    isActive?: boolean;
}

export const NavButton = ({href,label,isActive}:Props) => {
    return(
        <Button 
    asChild
    size="sm"
    variant="outline"
    className={cn(
        "w-full lg:w-auto justify-between font-normal border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none transition",
        isActive ? "bg-black/30 text-gray-900" : "bg-transparent text-gray-800 hover:bg-gray-200 hover:text-gray-900"
    )}
>
<Link href={href} className="font-semibold ml-1.5" style={{ fontSize: '14px' }}> {/* Adjust the font size as needed */}
    {label}
</Link>

</Button>

    )
}