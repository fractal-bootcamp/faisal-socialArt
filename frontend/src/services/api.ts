import axios from 'axios';
import { ArtFeed, ArtType } from './artService';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const fetchArtFeed = async () => {
    try {
        const response = await api.get('/art-feed');
        console.log('Art feed fetched successfully...');
        return response.data;
    } catch (error) {
        console.error('Error fetching art feed:', error);
        throw error;
    }
};

export const createArt = async (artData: ArtType) => {
    try {
        const response = await api.post('/art-feed', artData);
        console.log('Art created successfully...');
        return response.data;
    } catch (error) {
        console.error('Error creating art:', error);
        throw error;
    }
};

export const updateArt = async (id: string, artData: ArtFeed) => {
    try {
        const response = await api.put(`/art-feed/${id}`, artData);
        console.log('Art updated successfully...');
        return response.data;
    } catch (error) {
        console.error('Error updating art:', error);
        throw error;
    }
};

export const deleteArt = async (id: string) => {
    try {
        const response = await api.delete(`/art-feed/${id}`);
        console.log('Art deleted successfully...');
        return response.data;
    } catch (error) {
        console.error('Error deleting art:', error);
        throw error;
    }
};
