import React from 'react';
import { SidebarProvider } from '../ui/sidebar';
import ProfilePageContent from './ProfilePageContent';
import { ArtType } from '@/services/artService';
import PageSidebar from './PageSideBar';
import { SidebarTrigger } from '../ui/sidebar';

interface ProfilePageProps {
    userArts: ArtType[];
    userName: string;
    userAvatar: string;
    companyName?: string;
    sidebarDefaultOpen?: boolean;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
    userArts,
    userName,
    userAvatar,
    companyName,
    sidebarDefaultOpen = true
}) => {
    return (
        <SidebarProvider defaultOpen={sidebarDefaultOpen}>
            <div className="profile-page flex h-screen">
                <PageSidebar userName={userName} userAvatar={userAvatar} companyName={companyName || ''} />
                <div className="flex flex-grow">
                    <div className="p-4">
                        <SidebarTrigger />
                    </div>
                    <ProfilePageContent
                        userArts={userArts}
                        userName={userName}
                        userAvatar={userAvatar}
                    />
                </div>
            </div>
        </SidebarProvider>
    );
};

export default ProfilePage;