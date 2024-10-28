import { useClerk, useUser } from '@clerk/clerk-react';

export const useAuth = () => {
    console.log('Initializing useAuth hook');

    const { user, isSignedIn, isLoaded } = useUser();
    console.log('User from useUser:', user);

    const { session } = useClerk();

    return {
        isAuthenticated: isLoaded && isSignedIn,
        user,
        isLoaded,
        session,
        userId: user?.id,
    };
}