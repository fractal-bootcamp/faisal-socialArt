import React from 'react';
import { SidebarInset, SidebarTrigger } from '../ui/sidebar';
import { ArtType } from '@/services/artService';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfilePageContentProps {
    userArts?: ArtType[];
    userName?: string;
    userAvatar?: string;
}

const ProfilePageContent: React.FC<ProfilePageContentProps> = ({
    userArts = [],
    userName = "Michael Scott",
    userAvatar = "https://github.com/shadcn.png"
}) => {
    return (
        <SidebarInset className="flex-1">
            <SidebarTrigger className="absolute top-4 left-4" />
            <main className="flex flex-col items-center justify-start h-full w-full overflow-auto p-8">
                <div className="w-full max-w-4xl">
                    <div className="flex items-center mb-8">
                        <Avatar className="w-24 h-24 mr-4">
                            <AvatarImage src={userAvatar} alt={userName} />
                            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h1 className="text-3xl font-bold">{userName}'s Gallery</h1>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userArts.map((art) => (
                            <div key={art.id} className="border rounded-lg overflow-hidden">
                                <img src={art.userAvatar} alt={art.userName} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <p className="text-sm text-gray-500">{art.prompt}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </SidebarInset>
    );
};

export default ProfilePageContent;