import React from 'react';
import { SidebarProvider } from '../ui/sidebar';
import FeedPageContent from './FeedPageContent';
import { ArtType } from '@/services/artService';
import PageSidebar from './PageSideBar';
import { SidebarTrigger } from '../ui/sidebar';

interface FeedPageProps {
    initialItems?: ArtType[];
    userName?: string;
    userAvatar?: string;
    companyName?: string;
    sidebarDefaultOpen?: boolean;
}

const FeedPage: React.FC<FeedPageProps> = ({
    initialItems = [],
    userName,
    userAvatar = "https://github.com/shadcn.png",
    companyName,
    sidebarDefaultOpen = true
}) => {
    return (
        <SidebarProvider defaultOpen={sidebarDefaultOpen}>
            <div className="feed-page flex h-screen">
                <PageSidebar userName={userName || ''} userAvatar={userAvatar} companyName={companyName || ''} />
                <div className="flex flex-col flex-grow">
                    <div className="p-4">
                        <SidebarTrigger />
                    </div>
                    <FeedPageContent initialItems={initialItems} userName={userName || ''} userAvatar={userAvatar} />
                </div>
            </div>
        </SidebarProvider>
    );
};

export default FeedPage;