import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArtType, ArtWork, generateRandomArt } from '@/services/artService';
import ArtEditor from './ArtEditor';
import FeedPost from './FeedPost';
import { Toaster, toast } from 'sonner';
import { createArt, deleteArt, fetchArtFeed, updateArt } from '@/services/api';

interface FeedProps {
    displayAsGrid?: boolean;
}

const Feed: React.FC<FeedProps> = ({
    displayAsGrid = false,
}) => {
    const [feedItems, setFeedItems] = useState<ArtType[]>([]);
    const [editingArt, setEditingArt] = useState<ArtType | null>(null);

    useEffect(() => {
        const fetchArt = async () => {
            try {
                // Fetch art items from the API
                const fetchedArtItems = await fetchArtFeed();

                // Ensure fetchedArtItems is of type ArtFeed[]
                if (Array.isArray(fetchedArtItems)) {
                    setFeedItems(fetchedArtItems.map((item: ArtWork) => ({
                        id: item.id,
                        userName: item.userName,
                        userAvatar: item.userAvatar,
                        isAuthor: item.isAuthor,
                        authorId: item.authorId,
                        colorA: item.colorA,
                        colorB: item.colorB,
                        stripeCount: item.stripeCount,
                        style: item.style,
                    })));
                } else {
                    console.error('Fetched art items are not in the expected format');
                }
            } catch (error) {
                console.error('Error fetching art feed:', error);
            }
        };

        fetchArt();
    }, []);

    // Handle publishing new art
    const handlePublishArt = async (newArt: ArtType) => {
        console.log('handlePublishArt called with:', newArt);
        try {
            const artWithAuthor = {
                ...newArt,
                isAuthor: true,
            };
            console.log('Calling createArt with:', artWithAuthor);
            const createdArt = await createArt(artWithAuthor);
            console.log('Art created successfully:', createdArt);
            setFeedItems(prevItems => [createdArt, ...prevItems]);
            setEditingArt(null);
            toast.success('Art published successfully!');
        } catch (error) {
            console.error('Error publishing art:', error);
            toast.error('Failed to publish art. Please try again.');
        }
    };

    // Generate new random art
    const handleAddNewItem = () => {
        const newArt = generateRandomArt();
        setEditingArt({
            ...newArt,
            userAvatar: newArt.userAvatar,
            userName: newArt.userName,
            isAuthor: true,
        });
    };

    // Handle deleting art
    const handleDelete = async (artId: string) => {
        try {
            await deleteArt(artId);
            setFeedItems(prevItems => prevItems.filter(item => item.id !== artId));
            toast.success('Art deleted successfully!');
        } catch (error) {
            console.error('Error deleting art:', error);
            toast.error('Failed to delete art. Please try again.');
        }
    };

    // Handle editing art
    const handleEdit = async (updatedArt: ArtType) => {
        try {
            await updateArt(updatedArt.id, updatedArt);
            setFeedItems(prevItems => prevItems.map(item =>
                item.id === updatedArt.id ? updatedArt : item
            ));
            toast.success('Art updated successfully!');
        } catch (error) {
            console.error('Error updating art:', error);
            toast.error('Failed to update art. Please try again.');
        }
    };

    return (
        <div className="flex-grow overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">
                Art Feed
            </h2>
            <div className="feed-container min-h-screen w-full flex flex-col items-center overflow-y-auto px-4 pb-6">
                <Toaster />
                <div className="w-full max-w-md mb-6">
                    <Button onClick={handleAddNewItem} className="w-full">
                        Generate New Art
                    </Button>
                </div>
                <div className={`w-full ${displayAsGrid ? 'max-w-4xl grid grid-cols-3 gap-4' : 'max-w-md space-y-6'}`}>
                    {feedItems.map((item) => {
                        return (
                            <FeedPost
                                key={item.id}
                                art={item}
                                userAvatar={item.userAvatar}
                                userName={item.userName}
                                authorId={item.authorId}
                                isAuthor={item.isAuthor}
                                onLike={() => { }} // Placeholder for like functionality
                                onEdit={handleEdit}
                                onDelete={() => handleDelete(item.id)}
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
                        userAvatar={editingArt.userAvatar}
                        userName={editingArt.userName}
                        isEditing={false}
                    />
                )}
            </div>
        </div>
    );
};

export default Feed;
