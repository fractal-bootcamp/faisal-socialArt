import React from 'react';
import FeedPageContent from './FeedPageContent';
import { ArtType } from '@/services/artService';

interface FeedPageProps {
    initialItems?: ArtType[];
    userName: string;
    userAvatar: string;
}

const FeedPage: React.FC<FeedPageProps> = ({
    initialItems = [],
    userName,
    userAvatar
}) => {
    return (
        <FeedPageContent
            initialItems={initialItems}
            userName={userName || ''}
            userAvatar={userAvatar}
        />
    );
};

export default FeedPage;