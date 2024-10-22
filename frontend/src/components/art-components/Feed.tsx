import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArtType, generateRandomArt } from '@/services/artService';
import ArtEditor from './ArtEditor';
import FeedPost from './FeedPost';
import { Toaster, toast } from 'sonner';

interface FeedProps {
    initialItems?: ArtType[];
}

interface FeedItem extends ArtType {
    userName: string;
    isAuthor: boolean;
}
const Feed: React.FC<FeedProps> = ({ initialItems = [] }) => {
    const [feedItems, setFeedItems] = useState<FeedItem[]>(
        initialItems.map(item => ({
            ...item,
            userName: "Michael Scott",
            isAuthor: true
        }))
    );
    const [editingArt, setEditingArt] = useState<ArtType | null>(null);

    const handlePublishArt = (newArt: ArtType) => {
        const newFeedItem: FeedItem = {
            ...newArt,
            userName: "Michael Scott",
            isAuthor: true
        };
        setFeedItems(prevItems => [newFeedItem, ...prevItems]);
        setEditingArt(null);
        toast.success('Art published successfully!');
    };

    const handleAddNewItem = () => {
        const newArt = generateRandomArt();
        setEditingArt(newArt);
        //toast.success('New art generated!');
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
                        userAvatar="https://github.com/shadcn.png"
                        isEditing={false}
                        userName="Michael Scott"
                    />
                )}
                {feedItems.map((item) => (
                    <FeedPost
                        key={item.id}
                        art={item}
                        userAvatar="https://github.com/shadcn.png"
                        userName="Michael Scott"
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