import React from 'react';
import { SidebarProvider } from '../ui/sidebar';
import FeedPageContent from './FeedPageContent';
import { ArtType } from '@/services/artService';
import PageSidebar from './PageSidebar';

interface FeedPageProps {
    initialItems?: ArtType[];
    userName?: string;
    userAvatar?: string;
    sidebarDefaultOpen?: boolean;
}

const FeedPage: React.FC<FeedPageProps> = ({
    initialItems = [],
    userName = "Michael Scott",
    userAvatar = "https://github.com/shadcn.png",
    sidebarDefaultOpen = true
}) => {
    return (
        <SidebarProvider defaultOpen={sidebarDefaultOpen}>
            <div className="feed-page flex h-screen">
                <PageSidebar userName={userName} userAvatar={userAvatar} />
                <FeedPageContent initialItems={initialItems} />
            </div>
        </SidebarProvider>
    );
};

export default FeedPage;