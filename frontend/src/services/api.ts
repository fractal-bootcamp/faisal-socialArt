import axios from 'axios';
import { ArtType } from './artService';
import { z } from 'zod';

// Use the same port as the backend server
const port = 3000;
const API_BASE_URL = `http://localhost:${port}/api`;

// Create axios instance with baseURL
const api = axios.create({
    baseURL: API_BASE_URL,
});

// Function to fetch art feed
export const fetchArtFeed = async () => {
    try {
        // Use the correct endpoint as defined in server.ts
        const response = await api.get('/art-feed');
        // Define the ArtWork schema inline
        const ArtWorkSchema = z.object({
            id: z.string(),
            userAvatar: z.string(),
            userName: z.string(),
            isAuthor: z.boolean(),
            authorId: z.string(),
            colorA: z.object({
                h: z.number(),
                s: z.number(),
                b: z.number()
            }),
            colorB: z.object({
                h: z.number(),
                s: z.number(),
                b: z.number()
            }),
            stripeCount: z.number(),
            style: z.enum(['line', 'circle'])
        });

        // Parse the response data using the ArtWork schema
        // Parse each item in the response data array using the ArtWork schema
        const parsedResponse = z.array(ArtWorkSchema).parse(response.data);
        console.log({ message: 'Fetching art feed...', data: response.data });
        return parsedResponse;
    } catch (error) {
        // Match the error logging in the backend
        console.error('Error fetching art feed:', error);
        // Throw a more specific error to match the backend response
        throw new Error('Internal server error.');
    }
};

// Function to create new art
export const createArt = async (artData: ArtType) => {
    console.log('Creating art with data:', artData);
    // Convert the incoming data to match the Prisma schema
    const prismaArtData = {
        configuration: {
            colorA: artData.colorA,
            colorB: artData.colorB,
            stripeCount: artData.stripeCount,
            style: artData.style
        },
        authorId: artData.authorId,
        userAvatar: artData.userAvatar,
        userName: artData.userName,
        isAuthor: artData.isAuthor
    };

    console.log('Sending prismaArtData to server:', prismaArtData);

    try {
        // Use the correct endpoint as defined in server.ts
        const response = await api.post('/art-feed', prismaArtData);
        console.log('Server response:', response.data);

        // Define the ArtWork schema inline
        const ArtWorkSchema = z.object({
            id: z.string(),
            userAvatar: z.string(),
            userName: z.string(),
            isAuthor: z.boolean(),
            authorId: z.string(),
            colorA: z.object({
                h: z.number(),
                s: z.number(),
                b: z.number()
            }),
            colorB: z.object({
                h: z.number(),
                s: z.number(),
                b: z.number()
            }),
            stripeCount: z.number(),
            style: z.enum(['line', 'circle'])
        });

        // Parse the response data using the ArtWork schema
        const parsedResponse = ArtWorkSchema.parse(response.data);

        console.log('Parsed response:', parsedResponse);

        // Return the typed response
        console.log('Art created successfully...');
        return parsedResponse;
    } catch (error) {
        console.error('Error in createArt:', error);
        throw error;
    }
};

// Function to update existing art
export const updateArt = async (id: string, artData: ArtType) => {
    try {
        // Use the correct endpoint as defined in server.ts
        const response = await api.put(`/art-feed/${id}`, artData);
        console.log('Art updated successfully...');
        return response.data;
    } catch (error) {
        console.error('Error updating art:', error);
        throw error;
    }
};

// Function to delete art
export const deleteArt = async (id: string) => {
    try {
        // Use the correct endpoint as defined in server.ts
        const response = await api.delete(`/art-feed/${id}`);
        console.log('Art deleted successfully...');
        return response.data;
    } catch (error) {
        console.error('Error deleting art:', error);
        throw error;
    }
};
