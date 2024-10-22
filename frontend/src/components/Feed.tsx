import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArtType, generateRandomArt, updateFeed } from '@/services/artService';
import ArtWork from './ArtWork';
import ArtEditor from './ArtEditor';

interface FeedProps {
    initialItems?: ArtType[];
}

const Feed: React.FC<FeedProps> = ({ initialItems = [] }) => {
    const [feedItems, setFeedItems] = useState<ArtType[]>(initialItems);
    const [editingArt, setEditingArt] = useState<ArtType | null>(null);

    const handlePublishArt = (newArt: ArtType) => {
        const newFeed = updateFeed(newArt, feedItems)
        setFeedItems(newFeed);
        setEditingArt(null);
    };

    const handleAddNewItem = () => {
        const newArt = generateRandomArt();
        setEditingArt(newArt);
    };

    return (
        <div className="feed container mx-auto px-4 max-w-3xl">
            <div className="flex justify-center mb-6">
                <Button onClick={handleAddNewItem} className="sm:w-auto">Generate New Art</Button>
            </div>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {editingArt && (
                    <ArtEditor
                        initialArt={editingArt}
                        publishArt={handlePublishArt}
                    />
                )}
                {feedItems.map((item, index) => (
                    <ArtWork
                        key={index}
                        art={item}
                    />
                ))}
            </div>
        </div>
    );
};

export default Feed;