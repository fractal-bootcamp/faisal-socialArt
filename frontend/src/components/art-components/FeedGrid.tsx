import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArtType, generateRandomArt } from '@/services/artService';
import ArtEditor from './ArtEditor';
import FeedPost from './FeedPost';
import { Toaster, toast } from 'sonner';

interface FeedGridProps {
    initialItems?: ArtType[];
    userName: string;
    userAvatar?: string;
}

interface FeedItem extends ArtType {
    userName: string;
    isAuthor: boolean;
}

const FeedGrid: React.FC<FeedGridProps> = ({
    initialItems = [],
    userName,
    userAvatar = '', // Provide a default value for userAvatar
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
        <div className="feed-grid-container min-h-screen w-full flex flex-col items-center overflow-y-auto px-4 pb-6">
            <Toaster />
            <div className="w-full max-w-4xl mb-6">
                <Button onClick={handleAddNewItem} className="w-full">
                    Generate New Art
                </Button>
            </div>
            {/* Grid container */}
            <div className="w-full max-w-4xl grid grid-cols-2 gap-4">
                {editingArt && (
                    <div className="col-span-full">
                        <ArtEditor
                            initialArt={editingArt}
                            publishArt={handlePublishArt}
                            onClose={() => setEditingArt(null)}
                            userAvatar={userAvatar}
                            userName={userName}
                            isEditing={false}
                        />
                    </div>
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
                        displayAsGrid={true}
                        isProfilePage={true}
                    />
                ))}
            </div>
        </div>
    );
};

export default FeedGrid;
