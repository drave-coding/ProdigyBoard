"use client"
import { usePathname } from "next/navigation"
import { NavButton } from "./NavButton";



const routes = [
    {
        href:'/',
        label:"Overview",
    },
    {
        href:'/projects',
        label:"Projects",
    },
    {
        href:'/audience',
        label:"Audience",
    },
    {
        href:'/tasks',
        label:"Tasks",
    },
    
    {
        href:'/terms',
        label:"Terms",
    },
    {
        href:'/plans',
        label:"Plans",
    },
    
    
]
const Navigation = () => {

    const pathname = usePathname();




  return (
    <nav className="flex items-center gap-x-4 overflow-x-auto">
        {routes.map((route)=>(
            <NavButton
                key={route.href}
                href={route.href}
                label={route.label}
                isActive={pathname === route.href}
            />
        ))}
    </nav>
)
}

export default Navigation