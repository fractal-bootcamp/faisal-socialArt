import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { SidebarProvider } from '../ui/sidebar';
import PageSidebar from './PageSideBar';
import { SidebarTrigger } from '../ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RootLayoutProps {
    userName: string;
    userAvatar: string;
    companyName: string;
}

const RootLayout: React.FC<RootLayoutProps> = ({
    userName,
    userAvatar,
    companyName
}) => {
    return (
        <SidebarProvider defaultOpen={true}>
            <div className="min-h-screen flex">
                <PageSidebar userName={userName} userAvatar={userAvatar} companyName={companyName} />
                <div className="flex flex-col flex-grow">
                    <header className="bg-gray-800 text-white py-4 px-4">
                        <nav className="container mx-auto flex justify-between items-center">
                            <div className="flex space-x-4">
                                <Link to="/" className="text-lg font-semibold hover:text-gray-300">
                                    Art Feed
                                </Link>
                                <Link to="/profile" className="text-lg font-semibold hover:text-gray-300">
                                    Profile
                                </Link>
                            </div>
                            <div className="flex items-center space-x-4">
                                <SidebarTrigger />
                                <Avatar>
                                    <AvatarImage src={userAvatar} alt={userName} />
                                    <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </div>
                        </nav>
                    </header>

                    <main className="flex-grow container mx-auto py-4">
                        <Outlet />
                    </main>

                    <footer className="bg-gray-800 text-white text-xs py-2">
                        <div className="container mx-auto text-center">
                            © 2024 {companyName}
                        </div>
                    </footer>
                </div>
            </div>
        </SidebarProvider>
    );
};

export default RootLayout;