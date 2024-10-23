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
}

interface FeedItem extends ArtType {
    userName: string;
    isAuthor: boolean;
}

const Feed: React.FC<FeedProps> = ({ initialItems = [], userName, userAvatar }) => {
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
        <div className="feed-container min-h-screen flex flex-col items-center overflow-y-auto px-4 py-6">
            <Toaster />
            <div className="w-full max-w-md mb-6">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    Art Feed
                </h2>
                <Button onClick={handleAddNewItem} className="w-full">
                    Generate New Art
                </Button>
            </div>
            <div className="w-full max-w-md space-y-6">
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
                {feedItems.map((item) => (
                    <FeedPost
                        key={item.id}
                        art={item}
                        userAvatar={userAvatar}
                        userName={userName}
                        onLike={() => { }}
                        isAuthor={true}
                        onEdit={handleEdit}
                        onDelete={() => handleDelete(item.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Feed;