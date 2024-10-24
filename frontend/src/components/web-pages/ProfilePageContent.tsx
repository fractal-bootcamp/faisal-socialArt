import React from 'react';
import { SidebarInset } from '../ui/sidebar';
import { ArtFeed } from '@/services/artService';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FeedGrid from '../art-components/FeedGrid';

interface ProfilePageContentProps {
    userArts?: ArtFeed;
    userName: string;
    userAvatar: string;
}

const ProfilePageContent: React.FC<ProfilePageContentProps> = ({
    userArts = [],
    userName,
    userAvatar,
}) => {
    return (
        <SidebarInset className="flex-1">
            <main className="flex flex-col items-center justify-start h-full w-full overflow-auto p-8">
                <div className="w-full max-w-4xl">
                    <div className="flex items-center">
                        <Avatar className="w-24 h-24 mr-4">
                            <AvatarImage src={userAvatar} alt={`${userName} Logo`} />
                            <AvatarFallback>{userName?.charAt(0) ?? ''}</AvatarFallback>
                        </Avatar>

                        <h1 className="text-3xl font-bold">{userName ?? 'User'}'s Gallery</h1>
                    </div>

                    {/* Display the feed as a grid for the user's profile page */}
                    <FeedGrid
                        initialItems={userArts}
                        userName={userName ?? ''}
                        userAvatar={userAvatar ?? ''}
                    />
                </div>
            </main>
        </SidebarInset>
    );
};

export default ProfilePageContent;