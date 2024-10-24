import React from 'react';
import Feed from '../art-components/Feed';
import { ArtType } from '@/services/artService';

interface FeedPageContentProps {
    initialItems?: ArtType[];
    userName: string;
    userAvatar: string;
    handleDeleteArt: (artId: string) => void;
    onEditArt?: (updatedArt: ArtType) => void;
}

const FeedPageContent: React.FC<FeedPageContentProps> = ({ initialItems = [], userName, userAvatar, handleDeleteArt, onEditArt }) => {
    return (
        <div className="flex-grow overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">
                Art Feed
            </h2>
            <Feed
                initialItems={initialItems}
                userName={userName}
                userAvatar={userAvatar}
                handleDeleteArt={handleDeleteArt}
                onEditArt={onEditArt}
            />
        </div>
    );
};

export default FeedPageContent;