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
                        //likeCount: item.likes.length,
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

        const artWithAuthor = {
            ...newArt,
            userAvatar: newArt.userAvatar || '',
            userName: newArt.userName || '',
            authorId: newArt.authorId || '',
            isAuthor: true,
        };

        if (!artWithAuthor.authorId) {
            console.error('Author ID is missing!');
            toast.error('Cannot publish art without an author.');
            return;
        }

        try {
            console.log('Calling createArt with:', artWithAuthor);
            const createdArt = await createArt(artWithAuthor);
            console.log('Art created successfully:', createdArt);
            setFeedItems((prevItems) => [createdArt, ...prevItems]);
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
        console.log('Attempting to delete art with ID:', artId);
        console.log('Current feed items:', feedItems);
        try {
            const response = await deleteArt(artId);
            console.log('Delete API response:', response);

            setFeedItems(prevItems => {
                const newItems = prevItems.filter(item => item.id !== artId);
                console.log('New feed items after deletion:', newItems);
                console.log('Removed item:', prevItems.find(item => item.id === artId));
                return newItems;
            });

            toast.success('Art deleted successfully!');
        } catch (error: any) {
            console.error('Error deleting art:', error);
            console.log('Error details:', {
                message: error.message,
                stack: error.stack,
                response: error.response
            });
            toast.error('Failed to delete art. Please try again.');
        }
    };

    // Handle editing art
    const handleEdit = async (updatedArt: Partial<ArtType>) => {
        console.log('handleEdit called with:', updatedArt);
        try {
            const originalArt = feedItems.find(item => item.id === updatedArt.id);
            console.log('Original art found:', originalArt);
            if (!originalArt) {
                console.error('Original art not found for id:', updatedArt.id);
                throw new Error('Original art not found');
            }

            const updatedFields: ArtType = {
                ...originalArt,
                ...updatedArt,
                colorA: updatedArt.colorA || originalArt.colorA,
                colorB: updatedArt.colorB || originalArt.colorB,
                stripeCount: updatedArt.stripeCount || originalArt.stripeCount,
                style: updatedArt.style || originalArt.style
            };

            console.log('Updating art with:', updatedFields);
            const updatedArtWork = await updateArt(originalArt.id, updatedFields);
            console.log('Art updated successfully:', updatedArtWork);
            setFeedItems(prevItems => {
                const newItems = prevItems.map(item =>
                    item.id === updatedArtWork.id ? updatedArtWork : item
                );
                console.log('Updated feed items:', newItems);
                return newItems;
            });
            toast.success('Art updated successfully!');
        } catch (error) {
            // Log the error and its details
            console.error('Error updating art:', error);
            if (error instanceof Error) {
                console.log('Error details:', {
                    message: error.message,
                    stack: error.stack,
                    name: error.name
                });
            } else {
                console.log('Unknown error:', error);
            }
            // Display an error message to the user
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
