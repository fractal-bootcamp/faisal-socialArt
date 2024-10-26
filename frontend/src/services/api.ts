import axios from 'axios';
import { ArtType } from './artService';
import { z } from 'zod';
import { ArtWorkSchema } from '../../../common/schemas';
import { useClerk } from '@clerk/clerk-react';

const port = 3000;
const API_BASE_URL = `http://localhost:${port}/api`;

// Create axios instance with baseURL and interceptors
const api = axios.create({
    baseURL: API_BASE_URL,
});

console.log('Created axios instance');

// Add request interceptor to add auth token
api.interceptors.request.use(async (config) => {
    console.log('Intercepting request');
    try {
        // Get the token from Clerk
        const token = await getAuthToken();
        console.log('Got auth token:', token ? 'Token received' : 'No token', token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Added Authorization header', token);
        }
        return config;
    } catch (error) {
        console.error('Error setting auth token:', error);
        return config;
    }
});


// utils/getClerkToken.js
export async function getAuthToken() {
    try {
        // Get the window.__clerk__ instance
        const clerk = window?.Clerk;

        if (!clerk) {
            throw new Error('Clerk is not initialized');
        }

        // Get the session
        const session = await clerk.session;

        if (!session) {
            throw new Error('No active session');
        }

        // Get the token
        const token = await session.getToken();
        return token;
    } catch (error) {
        console.error('Error getting Clerk token:', error);
        throw error;
    }
}

// Define the ArtWork schema

type ArtWork = z.infer<typeof ArtWorkSchema>;

type Method = 'get' | 'post' | 'put' | 'delete';

type Route = '/art-feed' | `/art-feed/${string}` | `/profile/${string}` | `/art-feed/${string}/like`;

const LikeResponseSchema = z.object({
    likeCount: z.number()
});

export type LikeResponse = z.infer<typeof LikeResponseSchema>;

// Helper function to handle errors
const handleError = (error: unknown, errorMessage?: string): never => {
    console.error('Error occurred:', error);
    console.error('Error message:', errorMessage || 'An error occurred');
    throw new Error(errorMessage || 'An error occurred');
};

// Updated apiCall function with error handling
const apiCall = async <T>(
    method: Method,
    url: Route,
    data?: unknown,
    schema?: z.ZodType<T>,
    errorMessage?: string
): Promise<T> => {
    console.log(`Making API call: ${method.toUpperCase()} ${url}`);
    try {
        const response = await api[method](url, data);
        console.log('API response:', response.data);
        return schema ? schema.parse(response.data) : response.data as T;
    } catch (error: any) {
        // Enhanced error handling
        if (error.response?.status === 401) {
            console.error('Unauthorized error');
            throw new Error('Unauthorized: Please sign in');
        }
        if (error.response?.status === 403) {
            console.error('Forbidden error');
            throw new Error('Forbidden: You don\'t have permission to perform this action');
        }
        throw handleError(error, errorMessage);
    }
};

// Protected route functions
export const createArt = async (artData: ArtType) => {
    console.log('Creating art:', artData);
    const token = await getAuthToken();
    if (!token) {
        console.error('No authentication token');
        throw new Error('Authentication required');
    }
    return apiCall<ArtWork>('post', '/art-feed', artData, ArtWorkSchema, 'Failed to create art.');
};

export const updateArt = async (id: string, artData: Partial<ArtType>) => {
    console.log(`Updating art with id ${id}:`, artData);
    const token = await getAuthToken();
    if (!token) {
        console.error('No authentication token');
        throw new Error('Authentication required');
    }
    return apiCall<ArtWork>('put', `/art-feed/${id}`, artData, ArtWorkSchema, 'Failed to update art.');
};

export const updateLike = async (id: string, isLiked: boolean) => {
    console.log(`Updating like for art with id ${id}. isLiked: ${isLiked}`);
    const token = await getAuthToken();
    if (!token) {
        console.error('No authentication token');
        throw new Error('Authentication required');
    }
    return apiCall<LikeResponse>(
        'post',
        `/art-feed/${id}/like`,
        { isLiked },
        LikeResponseSchema,
        'Failed to update like.'
    );
};

export const deleteArt = async (id: string) => {
    console.log(`Deleting art with id ${id}`);
    const token = await getAuthToken();
    if (!token) {
        console.error('No authentication token');
        throw new Error('Authentication required');
    }
    return apiCall<void>('delete', `/art-feed/${id}`, undefined, undefined, 'Failed to delete art.');
};

// Public route functions
export const fetchArtFeed = () => {
    console.log('Fetching art feed');
    return apiCall<ArtWork[]>('get', '/art-feed', undefined, z.array(ArtWorkSchema), 'Failed to fetch art feed.');
}

export const fetchUserArtwork = (userName: string) => {
    console.log(`Fetching artwork for user: ${userName}`);
    return apiCall<ArtWork[]>('get', `/profile/${userName}`, undefined, z.array(ArtWorkSchema), 'Failed to fetch user artwork.');
}

// Add a function to check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
    console.log('Checking if user is authenticated');
    try {
        const token = await getAuthToken();
        const result = !!token;
        console.log(`User is ${result ? 'authenticated' : 'not authenticated'}`);
        return result;
    } catch {
        console.log('Error checking authentication, returning false');
        return false;
    }
};

// Add a function to check if user owns the artwork
export const useIsArtworkOwner = (client: ReturnType<typeof useClerk>): ((artwork: ArtWork) => boolean) => {
    return (artwork: ArtWork) => {
        console.log('Checking if user owns artwork:', artwork);
        try {

            const userId = client.session?.user.id;
            console.log('user ID:', userId);

            console.log('User ID:', artwork.authorId, userId);
            const result = artwork.authorId === userId;
            console.log(`User ${result ? 'owns' : 'does not own'} the artwork`);
            return result;
        } catch {
            console.log('Error checking artwork ownership, returning false');
            return false;
        }
    }
};