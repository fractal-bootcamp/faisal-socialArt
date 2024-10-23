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
                    <Link to="/" className="text-lg font-semibold hover:text-gray-300">
                        Art Feed
                    </Link>
                    <Link to="/profile" className="text-lg font-semibold hover:text-gray-300">
                        Profile
                    </Link>
                    <div className="flex items-center space-x-4">
                        <SidebarTrigger />
                        <Avatar>
                            <AvatarImage src={userAvatar} alt={userName} />
                            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                <main className="flex-grow container mx-auto py-4">
                    <Outlet />
                </main>
            </div>
        </SidebarProvider >
    );
};

export default RootLayout;