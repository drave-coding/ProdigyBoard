"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Menu } from "lucide-react"; // Replace with your icon import
import { FaProjectDiagram, FaUser, FaShieldAlt, FaHandsHelping, FaFileAlt, FaClipboardList, FaQuestionCircle } from 'react-icons/fa'; // Example icon imports

const userControlRoutes = [
    { href: '/projects', label: "Projects", icon: <FaProjectDiagram /> },
    { href: '/profile', label: "Profile", icon: <FaUser /> },
];

const securityRoutes = [
    { href: '/security', label: "Security", icon: <FaShieldAlt /> },
    { href: '/help', label: "Help & Support", icon: <FaHandsHelping /> },
];

const othersRoutes = [
    { href: '/privacy', label: "Privacy Policy", icon: <FaFileAlt /> },
    { href: '/contribute', label: "Contribute", icon: <FaClipboardList /> },
    { href: '/faqs', label: "FAQs", icon: <FaQuestionCircle /> },
    // WhatsApp icon
];

const SideBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const onClick = (href: string) => {
        router.push(href);
        if (isOpen) setIsOpen(false); // Close on navigation
    };

    return (
        <div className={`flex flex-col h-screen transition-width duration-300 ${isOpen ? 'w-52' : 'w-12'} bg-white rounded-lg`}>
            <div className="flex items-center justify-between p-2 px-1">
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center justify-center p-2 transition duration-200 rounded-md ${isOpen ? 'bg-gray-200' : 'bg-white'}`}
                >
                    <Menu className={`text-lg ${isOpen ? 'text-gray-900' : 'text-black'}`} />
                </Button>
            </div>
    
            <nav className="flex flex-col flex-grow p-2">
                {/* User Control Section */}
                <div className="py-2">
                    {userControlRoutes.map((route) => (
                        <Button
                            key={route.href}
                            onClick={() => onClick(route.href)}
                            className={`flex items-center w-full p-2 my-1 transition duration-200 hover:bg-gray-100 rounded-md ${route.href === pathname ? 'bg-gray-200' : 'bg-white'} shadow-none`}
                        >
                            <div className={`text-base flex items-center w-full ${route.href === pathname ? 'text-gray-900' : 'text-black'}`}>
                                {route.icon}
                                {isOpen && <span className={`ml-2`}>{route.label}</span>}
                            </div>
                        </Button>
                    ))}
                </div>
    
                <hr className="my-2 border-gray-300" />
    
                {/* Security Section */}
                <div className="py-2">
                    {securityRoutes.map((route) => (
                        <Button
                            key={route.href}
                            onClick={() => onClick(route.href)}
                            className={`flex items-center w-full p-2 my-1 transition duration-200 hover:bg-gray-100 rounded-md ${route.href === pathname ? 'bg-gray-200' : 'bg-white'} shadow-none`}
                        >
                            <div className={`text-base flex items-center w-full ${route.href === pathname ? 'text-gray-900' : 'text-black'}`}>
                                {route.icon}
                                {isOpen && <span className={`ml-2`}>{route.label}</span>}
                            </div>
                        </Button>
                    ))}
                </div>
    
                <hr className="my-2 border-gray-300" />
    
                {/* Others Section */}
                <div className="py-2">
                    {othersRoutes.map((route) => (
                        <Button
                            key={route.href}
                            onClick={() => onClick(route.href)}
                            className={`flex items-center w-full p-2 my-1 transition duration-200 hover:bg-gray-100 rounded-md ${route.href === pathname ? 'bg-gray-200' : 'bg-white'} shadow-none`}
                        >
                            <div className={`text-base flex items-center w-full ${route.href === pathname ? 'text-gray-900' : 'text-black'}`}>
                                {route.icon}
                                {isOpen && <span className={`ml-2`}>{route.label}</span>}
                            </div>
                        </Button>
                    ))}
                </div>
            </nav>
        </div>
    );
    
    
};

export default SideBar;
