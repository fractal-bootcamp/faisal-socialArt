import React from 'react';
import ProfilePageContent from './ProfilePageContent';
import { useUser } from '@clerk/clerk-react';

const ProfilePage: React.FC = () => {
    const { user } = useUser();

    return (
        <ProfilePageContent
            userName={user?.fullName || user?.username || 'User'}
            userAvatar={user?.imageUrl}
        />
    );
};

export default ProfilePage;