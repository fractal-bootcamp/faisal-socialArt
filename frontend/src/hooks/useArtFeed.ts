import { useState, useEffect } from 'react';
import { ArtType, generateRandomArt } from '@/services/artService';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import { useClerk } from '@clerk/clerk-react';
import {
    createArt,
    deleteArt,
    fetchArtFeed,
    updateArt,
    useIsArtworkOwner
} from '@/services/api';

export const useArtFeed = () => {
    console.log('Initializing useArtFeed hook');

    const [feedItems, setFeedItems] = useState<ArtType[]>([]);
    const [editingArt, setEditingArt] = useState<ArtType | null>(null);
    const { isAuthenticated, user } = useAuth();
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

    // Function to open editor with new generated art
    const handleGenerateNewArt = () => {
        if (!isAuthenticated) {
            toast.error('Please sign in to start Jammin art');
            return;
        }

        const newArt = {
            ...generateRandomArt(),
            userAvatar: user?.imageUrl || '',
            userName: user?.username || '',
            authorId: user?.id || '',
            isAuthor: true,
        };

        setEditingArt(newArt);
    };

    // Separate function to handle publishing
    const handlePublishArt = async (artToPublish: ArtType) => {
        try {
            const createdArt = await createArt(artToPublish);
            setFeedItems(prevItems => [createdArt, ...prevItems]);
            setEditingArt(null);
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
            console.log('User not authenticated');
            return;
        }

        const artToDelete = feedItems.find(item => item.id === artId);
        console.log('Art to delete:', artToDelete);
        if (!artToDelete || !isArtworkOwner(artToDelete)) {
            console.log('User cannot delete this art');
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
            console.log('User not authenticated');
            return;
        }

        const originalArt = feedItems.find(item => item.id === updatedArt.id);
        console.log('Original art:', originalArt);
        if (!originalArt || !isArtworkOwner(originalArt)) {
            console.log('User cannot edit this art');
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
        // Check if the user is authenticated and owns the artwork
        const result = isAuthenticated && isArtworkOwner(art);
        console.log('canModifyArt called for:', art, 'Result:', result);
        return result || false;
    };

    console.log('Returning useArtFeed hook values');
    return {
        feedItems,
        editingArt,
        setEditingArt,
        handleGenerateNewArt,
        handlePublishArt,
        handleDelete,
        handleEdit,
        canModifyArt,
        isAuthenticated,
        user
    };
}
