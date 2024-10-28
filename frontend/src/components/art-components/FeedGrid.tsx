import React from 'react';
import { Button } from "@/components/ui/button";
import ArtEditor from './ArtEditor';
import FeedPost from './FeedPost';
import { Toaster } from 'sonner';
import { useArtFeed } from '@/hooks/useArtFeed';
import { ArtWork } from '../../../../common/types';

interface FeedGridProps {
    userName: string;
    userAvatar: string;
    isProfilePage?: boolean;
    handleDeleteArt: (id: string) => void;
    onEditArt: (art: Partial<ArtWork>) => void;
    feedItems: ArtWork[];
}

const FeedGrid: React.FC<FeedGridProps> = ({
    userName,
    userAvatar,
    isProfilePage = true,
    handleDeleteArt,
    onEditArt,
    feedItems
}) => {
    const {
        handleGenerateNewArt,
        handlePublishArt,
        canModifyArt,
        editingArt,
        setEditingArt,
    } = useArtFeed();

    return (
        <div className="feed-grid-container min-h-screen w-full flex flex-col items-center overflow-y-auto px-4 pb-6">
            <Toaster />
            <div className="w-full max-w-4xl my-6">
                <Button onClick={handleGenerateNewArt} className="w-full">
                    Generate New Art
                </Button>
            </div>
            <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {feedItems.map((item) => (
                    <FeedPost
                        key={item.id}
                        art={item}
                        userAvatar={userAvatar}
                        userName={userName}
                        authorId={item.authorId}
                        isAuthor={canModifyArt(item)}
                        onLike={() => { }} // Placeholder for like functionality
                        onEdit={onEditArt}
                        onDelete={() => handleDeleteArt(item.id || '')}
                        displayAsGrid={true}
                        isProfilePage={isProfilePage}
                    />
                ))}
            </div>
            {editingArt && (
                <ArtEditor
                    initialArt={editingArt}
                    publishArt={handlePublishArt}
                    onClose={() => setEditingArt(null)}
                    userAvatar={userAvatar}
                    isEditing={false}
                    userName={userName}
                />
            )}
        </div>
    );
};

export default FeedGrid;
