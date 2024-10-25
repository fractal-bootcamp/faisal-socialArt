import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArtType, generateRandomArt } from '@/services/artService';
import ArtEditor from './ArtEditor';
import FeedPost from './FeedPost';
import { Toaster, toast } from 'sonner';

interface FeedGridProps {
    initialItems?: ArtType[];
    userName: string;
    userAvatar: string;
    isProfilePage?: boolean;
    handleDeleteArt: (artId: string) => void;
    onEditArt?: (updatedArt: ArtType) => void;
}

interface FeedItem extends ArtType {
    userName: string;
    isAuthor: boolean;
}

const FeedGrid: React.FC<FeedGridProps> = ({
    initialItems = [],
    userName,
    userAvatar,
    isProfilePage = true,
    onEditArt
}) => {
    const [feedItems, setFeedItems] = useState<FeedItem[]>(
        initialItems.map(item => ({
            ...item,
            userName: userName,
            isAuthor: true
        }))
    );
    const [editingArt, setEditingArt] = useState<ArtType | null>(null);

    // Handle publishing new art
    const handlePublishArt = (newArt: ArtType) => {
        try {
            const newFeedItem: FeedItem = {
                ...newArt,
                userName: userName,
                isAuthor: true
            };
            setFeedItems(prevItems => [newFeedItem, ...prevItems]);
            setEditingArt(null);
            toast.success('Art published successfully!');
        } catch (error) {
            toast.error('Failed to publish art. Please try again.');
        }
    };

    // Handle generating new random art
    const handleAddNewItem = () => {
        const newArt = generateRandomArt();
        setEditingArt(newArt);
    };

    // Handle deleting art
    const handleDelete = (artId: string) => {
        try {
            setFeedItems(prevItems => prevItems.filter(item => item.id !== artId));
            toast.success('Art deleted successfully!');
        } catch (error) {
            toast.error('Failed to delete art. Please try again.');
        }
    };

    // Handle editing art
    const handleEdit = (updatedArt: ArtType) => {
        setFeedItems(prevItems => prevItems.map(item =>
            item.id === updatedArt.id ? { ...item, ...updatedArt } : item
        ));
        try {
            if (onEditArt) onEditArt(updatedArt);
            toast.success('Art updated successfully!');
        } catch (error) {
            toast.error('Failed to update art. Please try again.');
        }
    };

    return (
        <div className="feed-grid-container min-h-screen w-full flex flex-col items-center overflow-y-auto px-4 pb-6">
            <Toaster />
            <div className="w-full max-w-4xl my-6">
                <Button onClick={handleAddNewItem} className="w-full">
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
                        isAuthor={true}
                        onLike={() => { }} // Placeholder for like functionality
                        onEdit={handleEdit}
                        onDelete={() => handleDelete(item.id)}
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
