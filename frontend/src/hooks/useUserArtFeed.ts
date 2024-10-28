import { useState, useEffect } from 'react';
import { ArtWork } from '../../../common/types';
import { fetchUserArtwork, useIsArtworkOwner } from '@/services/api';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import { useClerk } from '@clerk/clerk-react';

export const useUserArtFeed = (userName: string) => {
    const [feedItems, setFeedItems] = useState<ArtWork[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isLoaded } = useAuth();
    const client = useClerk();
    const isArtworkOwner = useIsArtworkOwner(client);

    useEffect(() => {
        const fetchArt = async () => {
            try {
                setIsLoading(true);
                if (!isLoaded || !userName) {
                    return;
                }

                const fetchedArtItems = await fetchUserArtwork(userName);
                setFeedItems(fetchedArtItems);
            } catch (error) {
                console.error('Error fetching user art:', error);
                toast.error('Failed to load user artwork');
            } finally {
                setIsLoading(false);
            }
        };
        fetchArt();
    }, [isLoaded, userName]);

    return {
        feedItems,
        isLoading
    };
};
