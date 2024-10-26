import { useEffect, useState } from 'react';
import { useClerk, useUser } from '@clerk/clerk-react';
import { isAuthenticated } from '../services/api';

export const useAuth = () => {
    console.log('Initializing useAuth hook'); // Debug log

    const { user } = useUser();
    console.log('User from useUser:', user); // Debug log

    const { session } = useClerk();
    console.log('Session from useClerk:', session); // Debug log

    const [isAuthed, setIsAuthed] = useState(false);
    console.log('Initial isAuthed state:', isAuthed); // Debug log

    useEffect(() => {
        console.log('useEffect triggered'); // Debug log

        const checkAuth = async () => {
            console.log('Checking authentication'); // Debug log
            const authed = await isAuthenticated();
            console.log('Authentication result:', authed); // Debug log
            setIsAuthed(authed);
        };
        checkAuth();
    }, [user, session]);

    console.log('Returning useAuth hook values'); // Debug log
    return {
        isAuthenticated: isAuthed,
        user,
        session,
        userId: user?.id,
    };
}