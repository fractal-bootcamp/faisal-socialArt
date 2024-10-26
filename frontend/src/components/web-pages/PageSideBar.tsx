import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import {
    LayoutDashboard,
    User,
    LogOut,
    ChevronsUpDown
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from '../ui/button';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser, SignOutButton } from '@clerk/clerk-react';

interface PageSidebarProps {
    companyName: string;
}

const PageSidebar: React.FC<PageSidebarProps> = ({
    companyName,
}) => {
    const { user } = useUser();

    return (
        // TODO: Add collapsible="icon" when we have a conditional design for the icon
        <Sidebar variant="sidebar">
            <SidebarHeader>
                <Button variant="ghost" className="flex items-center justify-between w-full min-h-12 hover:bg-transparent">
                    <div className="flex items-center space-x-2">
                        <Avatar>
                            <AvatarImage src="" alt={`${companyName} Logo`} />
                            <AvatarFallback>{companyName.charAt(0)}</AvatarFallback>
                        </Avatar>

                        <span className="text-xl font-bold">{companyName}</span>
                    </div>
                </Button>

            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu className="p-2">
                    {/* Art Feed link */}
                    <SidebarMenuItem className="min-h-10 hover:bg-gray-100 rounded-lg">
                        <Link to="/art-feed" className="w-full">
                            <SidebarMenuButton className="flex items-center w-full h-full">
                                <div className="flex items-center">
                                    <LayoutDashboard className="h-5 w-5 mr-2" />

                                    <span>Art Feed</span>
                                </div>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    {/* Profile link */}
                    <SidebarMenuItem className="min-h-10 hover:bg-gray-100 rounded-lg">
                        <Link to="/profile" className="w-full">
                            <SidebarMenuButton className="flex items-center w-full h-full">
                                <div className="flex items-center">
                                    <User className="h-5 w-5 mr-2" />

                                    <span>Profile</span>
                                </div>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="border-b">
                <SignedIn>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center justify-between w-full min-h-12">
                                <div className="flex items-center space-x-2">
                                    <UserButton />
                                    <span>{user?.fullName || 'Account'}</span>
                                </div>
                                <ChevronsUpDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem>
                                <LogOut className="h-4 w-4 mr-2" />
                                {/* Wrap the SignOutButton with SignedOut component */}
                                <SignedOut>
                                    <Button variant="ghost" className="flex items-center justify-center w-full min-h-12">
                                        {/* Use SignOutButton without the 'mode' prop */}
                                        <SignOutButton signOutOptions={{ redirectUrl: '/' }} />
                                    </Button>
                                </SignedOut>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SignedIn>
            </SidebarFooter>
            <div className="container py-1 align-center justify-center text-center text-xs mt-1">
                © 2024 {companyName}
            </div>
        </Sidebar>
    );
};

export default PageSidebar;
