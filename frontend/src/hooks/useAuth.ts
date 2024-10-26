import { useEffect, useState } from 'react';
import { useClerk, useUser } from '@clerk/clerk-react';
import { isAuthenticated } from '../services/api';

export const useAuth = () => {
    console.log('Initializing useAuth hook'); // Debug log

    const { user, isSignedIn } = useUser();
    console.log('User from useUser:', user); // Debug log

    const { session } = useClerk();

    return {
        isAuthenticated: isSignedIn,
        user,
        session,
        userId: user?.id,
    };
}