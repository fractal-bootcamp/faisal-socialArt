import React from 'react';
import Feed from '../art-components/Feed';
import { ArtType } from '@/services/artService';

interface FeedPageContentProps {
    initialItems?: ArtType[];
    userName: string;
    userAvatar: string;
}

const FeedPageContent: React.FC<FeedPageContentProps> = ({ initialItems = [], userName, userAvatar }) => {
    return (
        <div className="flex-grow overflow-y-auto p-6">
            <Feed
                initialItems={initialItems}
                userName={userName}
                userAvatar={userAvatar}
            />
        </div>
    );
};

export default FeedPageContent;