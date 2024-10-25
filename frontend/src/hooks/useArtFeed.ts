import { useState, useEffect } from 'react';
import { ArtType, generateRandomArt } from '@/services/artService';
import { createArt, deleteArt, fetchArtFeed, updateArt } from '@/services/api';
import { toast } from 'sonner';

export function useArtFeed() {
    const [feedItems, setFeedItems] = useState<ArtType[]>([]);
    const [editingArt, setEditingArt] = useState<ArtType | null>(null);

    useEffect(() => {
        const fetchArt = async () => {
            const fetchedArtItems = await fetchArtFeed();
            setFeedItems(fetchedArtItems);
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

        const originalArt = feedItems.find(item => item.id === updatedArt.id);
        if (!originalArt || typeof originalArt.id !== 'string') {
            throw new Error('Invalid art ID');
        }

        try {
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

    return { feedItems, editingArt, setEditingArt, handlePublishArt, handleAddNewItem, handleDelete, handleEdit };
}
