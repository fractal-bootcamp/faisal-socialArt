import { useClerk, useUser } from '@clerk/clerk-react';

export const useAuth = () => {
    console.log('Initializing useAuth hook');

    const { user, isSignedIn } = useUser();
    console.log('User from useUser:', user);

    const { session } = useClerk();

    return {
        isAuthenticated: isSignedIn,
        user,
        session,
        userId: user?.id,
    };
}