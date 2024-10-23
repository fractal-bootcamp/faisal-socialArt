import React from 'react';
import ProfilePageContent from './ProfilePageContent';
import { ArtType } from '@/services/artService';

interface ProfilePageProps {
    userArts: ArtType[];
    userName: string;
    userAvatar: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
    userArts,
    userName,
    userAvatar
}) => {
    return (
        <ProfilePageContent
            userArts={userArts}
            userName={userName}
            userAvatar={userAvatar}
        />
    );
};

export default ProfilePage;