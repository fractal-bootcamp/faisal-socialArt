import React from 'react';
import { Button } from "@/components/ui/button";
import ArtEditor from './ArtEditor';
import FeedPost from './FeedPost';
import { Toaster } from 'sonner';
import { useArtFeed } from '@/hooks/useArtFeed';

interface FeedProps {
    displayAsGrid?: boolean;
}

const Feed: React.FC<FeedProps> = ({
    displayAsGrid = false,
}) => {
    const {
        feedItems,
        editingArt,
        setEditingArt,
        handleGenerateNewArt,
        handlePublishArt,
        handleDelete,
        handleEdit,
        canModifyArt,
        isLoaded,
        isLoading,
    } = useArtFeed();

    if (!isLoaded && !isLoading) {
        // Return centered loading spinner with text
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mb-4"></div>
                <div>Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex-grow overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">
                Art Feed
            </h2>
            <div className="feed-container min-h-screen w-full flex flex-col items-center overflow-y-auto px-4 pb-6">
                <Toaster />
                <div className="w-full max-w-md mb-6">
                    <Button onClick={handleGenerateNewArt} className="w-full">
                        Generate New Art
                    </Button>
                </div>
                <div className={`w-full ${displayAsGrid ? 'max-w-4xl grid grid-cols-3 gap-4' : 'max-w-md space-y-6'}`}>
                    {feedItems.map((item) => {
                        return (
                            <FeedPost
                                key={item.id}
                                art={item}
                                userAvatar={item.userAvatar || ''}
                                userName={item.userName || ''}
                                authorId={item.authorId || ''}
                                isAuthor={canModifyArt(item)}
                                onLike={() => { }} // Placeholder for like functionality
                                onEdit={handleEdit}
                                onDelete={() => handleDelete(item.id || '')}
                                displayAsGrid={displayAsGrid}
                            />
                        );
                    })}
                </div>
                {/* Render ArtEditor at the end of the component */}
                {editingArt && (
                    <ArtEditor
                        initialArt={editingArt}
                        publishArt={handlePublishArt}
                        onClose={() => setEditingArt(null)}
                        userAvatar={editingArt.userAvatar || ''}
                        userName={editingArt.userName || ''}
                        isEditing={false}
                    />
                )}
            </div>
        </div>
    );
};

export default Feed;
