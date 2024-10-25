import axios from 'axios';
import { ArtType } from './artService';
import { z } from 'zod';
import { ArtWorkSchema } from '../../../common/schemas';

const port = 3000;
const API_BASE_URL = `http://localhost:${port}/api`;

// Create axios instance with baseURL
const api = axios.create({
    baseURL: API_BASE_URL,
});


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
    console.error(error);
    throw new Error(errorMessage || 'An error occurred');
};

const apiCall = async <T>(
    method: Method,
    url: Route,
    data?: unknown,
    schema?: z.ZodType<T>,
    errorMessage?: string
): Promise<T> => {
    try {
        const response = await api[method](url, data);
        return schema ? schema.parse(response.data) : response.data as T;
    } catch (error) {
        throw handleError(error, errorMessage);
    }
};

export const fetchArtFeed = () =>
    apiCall<ArtWork[]>('get', '/art-feed', undefined, z.array(ArtWorkSchema), 'Failed to fetch art feed.');

export const createArt = (artData: ArtType) =>
    apiCall<ArtWork>('post', '/art-feed', artData, ArtWorkSchema, 'Failed to create art.');

export const updateArt = (id: string, artData: Partial<ArtType>) =>
    apiCall<ArtWork>('put', `/art-feed/${id}`, artData, ArtWorkSchema, 'Failed to update art.');

export const updateLike = (id: string, isLiked: boolean) =>
    apiCall<LikeResponse>('post', `/art-feed/${id}/like`, { isLiked }, LikeResponseSchema, 'Failed to update like.');

export const deleteArt = (id: string) =>
    apiCall<void>('delete', `/art-feed/${id}`, undefined, undefined, 'Failed to delete art.');

export const fetchUserArtwork = (userName: string) =>
    apiCall<ArtWork[]>('get', `/profile/${userName}`, undefined, z.array(ArtWorkSchema), 'Failed to fetch user artwork.');
