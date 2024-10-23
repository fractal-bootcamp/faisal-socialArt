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

interface PageSidebarProps {
    userName: string;
    userAvatar: string;
    companyName: string;
}

const PageSidebar: React.FC<PageSidebarProps> = ({
    userName,
    userAvatar,
    companyName,
}) => {
    return (
        <Sidebar>
            <SidebarHeader className="py-4">
                <div className="flex items-center space-x-2">
                    <Avatar>
                        <AvatarImage src="" alt={`${companyName} Logo`} />
                        <AvatarFallback>{companyName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xl font-bold">{companyName}</span>
                </div>
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

            <SidebarFooter className="py-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center justify-between w-full min-h-12">
                            <div className="flex items-center space-x-2">
                                <Avatar>
                                    <AvatarImage src={userAvatar} alt={`${userName} Avatar`} />
                                    <AvatarFallback>{userName[0]}</AvatarFallback>
                                </Avatar>
                                <span>{userName}</span>
                            </div>
                            <ChevronsUpDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem>
                            <LogOut className="h-4 w-4 mr-2" />
                            <span>Logout</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarFooter>
        </Sidebar>
    );
};

export default PageSidebar;