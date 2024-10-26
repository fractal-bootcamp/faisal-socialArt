import { useState, useEffect } from 'react';
import { ArtType, generateRandomArt } from '@/services/artService';
import { createArt, deleteArt, fetchArtFeed, updateArt, useIsArtworkOwner } from '@/services/api';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import { useClerk } from '@clerk/clerk-react';

export function useArtFeed() {
    console.log('Initializing useArtFeed hook');

    const [feedItems, setFeedItems] = useState<ArtType[]>([]);
    const [editingArt, setEditingArt] = useState<ArtType | null>(null);
    const { isAuthenticated, user } = useAuth(); // Use the auth hook
    const client = useClerk();
    const isArtworkOwner = useIsArtworkOwner(client);

    console.log('Initial state:', { feedItems, editingArt, isAuthenticated, user });

    useEffect(() => {
        console.log('useEffect triggered for fetching art');
        const fetchArt = async () => {
            try {
                console.log('Fetching art feed');
                const fetchedArtItems = await fetchArtFeed();
                console.log('Fetched art items:', fetchedArtItems);
                setFeedItems(fetchedArtItems);
            } catch (error) {
                console.error('Error fetching art:', error);
                toast.error('Failed to load art feed');
            }
        };
        fetchArt();
    }, []);

    // Combined function to generate and publish art
    const handleGenerateAndPublishArt = async () => {
        console.log('handleGenerateAndPublishArt called');
        // Check authentication
        if (!isAuthenticated) {
            console.log('User not authenticated, showing error toast');
            toast.error('Please sign in to start Jammin art');
            return;
        }

        // Generate new art with author details
        const newArt = {
            ...generateRandomArt(),
            userAvatar: user?.imageUrl || '',
            userName: user?.username || '',
            authorId: user?.id || '',
            isAuthor: true,
        };
        console.log('Generated new art:', newArt);

        try {
            console.log('Creating art');
            const createdArt = await createArt(newArt);
            console.log('Created art:', createdArt);
            setFeedItems(prevItems => {
                console.log('Updating feed items with new art');
                return [createdArt, ...prevItems];
            });
            toast.success('Art published successfully!');
        } catch (error) {
            console.error('Error publishing art:', error);
            toast.error('Failed to publish art. Please try again.');
        }
    };

    // Handle deleting art
    const handleDelete = async (artId: string) => {
        console.log('handleDelete called with artId:', artId);
        if (!isAuthenticated) {
            console.log('User not authenticated, showing error toast');
            toast.error('Please sign in to delete art');
            return;
        }

        const artToDelete = feedItems.find(item => item.id === artId);
        console.log('Art to delete:', artToDelete);
        if (!artToDelete || !isArtworkOwner(artToDelete)) {
            console.log('User cannot delete this art, showing error toast');
            toast.error('You can only delete your own art');
            return;
        }

        try {
            console.log('Deleting art');
            await deleteArt(artId);
            setFeedItems(prevItems => {
                console.log('Updating feed items after deletion');
                return prevItems.filter(item => item.id !== artId);
            });
            toast.success('Art deleted successfully!');
        } catch (error) {
            console.error('Error deleting art:', error);
            toast.error('Failed to delete art. Please try again.');
        }
    };

    // Handle editing art
    const handleEdit = async (updatedArt: Partial<ArtType>) => {
        console.log('handleEdit called with:', updatedArt);
        if (!isAuthenticated) {
            console.log('User not authenticated, showing error toast');
            toast.error('Please sign in to edit art');
            return;
        }

        const originalArt = feedItems.find(item => item.id === updatedArt.id);
        console.log('Original art:', originalArt);
        if (!originalArt || !isArtworkOwner(originalArt)) {
            console.log('User cannot edit this art, showing error toast');
            toast.error('You can only edit your own art');
            return;
        }

        if (!originalArt.id) {
            console.log('Original art has no id, returning');
            return;
        }
        try {
            const updatedFields: ArtType = {
                ...originalArt,
                ...updatedArt,
            };
            console.log('Updated fields:', updatedFields);

            console.log('Updating art');
            const updatedArtWork = await updateArt(originalArt.id, updatedFields);
            console.log('Updated artwork:', updatedArtWork);
            setFeedItems(prevItems => {
                console.log('Updating feed items with edited art');
                return prevItems.map(item => item.id === updatedArtWork.id ? updatedArtWork : item);
            });
            toast.success('Art updated successfully!');
        } catch (error) {
            console.error('Error updating art:', error);
            toast.error('Failed to update art. Please try again.');
        }
    };

    // Add a function to check if user can edit/delete an artwork
    const canModifyArt = (art: ArtType): boolean => {
        const result = isAuthenticated && isArtworkOwner(art);
        console.log('canModifyArt called for:', art, 'Result:', result);
        return result;
    };

    console.log('Returning useArtFeed hook values');
    return {
        feedItems,
        editingArt,
        setEditingArt,
        handleGenerateAndPublishArt,
        handleDelete,
        handleEdit,
        canModifyArt,
        isAuthenticated,
        user
    };
}
