import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArtType, generateRandomArt } from '@/services/artService';
import ArtEditor from './ArtEditor';
import FeedPost from './FeedPost';
import { Toaster, toast } from 'sonner';

interface FeedProps {
    initialItems?: ArtType[];
    userName: string;
    userAvatar: string;
    displayAsGrid?: boolean;
}

interface FeedItem extends ArtType {
    userName: string;
    isAuthor: boolean;
}

const Feed: React.FC<FeedProps> = ({
    initialItems = [],
    userName,
    userAvatar,
    displayAsGrid = false
}) => {
    const [feedItems, setFeedItems] = useState<FeedItem[]>(
        initialItems.map(item => ({
            ...item,
            userName: userName,
            isAuthor: true
        }))
    );
    const [editingArt, setEditingArt] = useState<ArtType | null>(null);

    const handlePublishArt = (newArt: ArtType) => {
        const newFeedItem: FeedItem = {
            ...newArt,
            userName: userName,
            isAuthor: true
        };
        setFeedItems(prevItems => [newFeedItem, ...prevItems]);
        setEditingArt(null);
        toast.success('Art published successfully!');
    };

    const handleAddNewItem = () => {
        const newArt = generateRandomArt();
        setEditingArt(newArt);
    };

    const handleDelete = (artId: string) => {
        setFeedItems(prevItems => prevItems.filter(item => item.id !== artId));
        toast.success('Art deleted successfully!');
    };

    const handleEdit = (updatedArt: ArtType) => {
        setFeedItems(prevItems => prevItems.map(item =>
            item.id === updatedArt.id ? { ...item, ...updatedArt } : item
        ));
        toast.success('Art updated successfully!');
    };

    return (
        <div className="feed-container min-h-screen w-full flex flex-col items-center overflow-y-auto px-4 pb-6">
            <Toaster />
            <div className="w-full max-w-md mb-6">
                <Button onClick={handleAddNewItem} className="w-full">
                    Generate New Art
                </Button>
            </div>
            <div className={`w-full ${displayAsGrid ? 'max-w-4xl grid grid-cols-3 gap-4' : 'max-w-md space-y-6'}`}>
                {feedItems.map((item) => (
                    <FeedPost
                        key={item.id}
                        art={item}
                        userAvatar={userAvatar}
                        userName={userName}
                        isAuthor={true}
                        onLike={() => { }}
                        onEdit={handleEdit}
                        onDelete={() => handleDelete(item.id)}
                        displayAsGrid={displayAsGrid}
                    />
                ))}
            </div>
            {/* Render ArtEditor at the end of the component */}
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

export default Feed;
