import React from 'react';
import { SidebarInset } from '../ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FeedGrid from '../art-components/FeedGrid';
import { useUserArtFeed } from '@/hooks/useUserArtFeed';
import { useArtFeed } from '@/hooks/useArtFeed';

interface ProfilePageContentProps {
    userName: string;
    userAvatar?: string;
}

const ProfilePageContent: React.FC<ProfilePageContentProps> = ({
    userName,
    userAvatar,
}) => {
    // Get user's artwork and loading state
    const { feedItems, isLoading } = useUserArtFeed(userName);

    // Get edit and delete handlers
    const { handleDelete, handleEdit } = useArtFeed();

    return (
        <SidebarInset className="flex-1">
            <main className="flex flex-col items-center justify-start h-full w-full overflow-auto p-8">
                <div className="w-full max-w-4xl">
                    <div className="flex items-center">
                        <Avatar className="w-24 h-24 mr-4">
                            <AvatarImage src={userAvatar} alt={`${userName} Avatar`} />
                            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h1 className="text-3xl font-bold">{userName}'s Gallery</h1>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-8">Loading gallery...</div>
                    ) : (
                        <FeedGrid
                            userName={userName}
                            userAvatar={userAvatar || ''}
                            isProfilePage={true}
                            handleDeleteArt={handleDelete}
                            onEditArt={handleEdit}
                            feedItems={feedItems}
                        />
                    )}
                </div>
            </main>
        </SidebarInset>
    );
};

export default ProfilePageContent;
