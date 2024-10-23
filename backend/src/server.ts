import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { ArtWork } from '../frontend/src/services/artService';

const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (_req, res) => {
    res.send('Hello, World!');
});

app.get('/api/art-feed', async (_req: Request, res: Response) => {
    try {
        const artFeed = await prisma.artWork.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(artFeed);
    } catch (error) {
        console.error('Error fetching art feed:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/art-feed/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const artPiece = await prisma.artWork.findUnique({
            where: { id }
        });
        if (!artPiece) {
            return res.status(404).json({ error: 'Art piece not found' });
        }
        res.json(artPiece);
    } catch (error) {
        console.error('Error fetching art piece:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/art-feed', async (req: Request, res: Response) => {
    try {
        const artData: ArtWork = req.body;
        const newArtPiece = await prisma.artWork.create({
            data: artData
        });
        res.status(201).json(newArtPiece);
    } catch (error) {
        console.error('Error creating art piece:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/art-feed/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const artData: Partial<ArtWork> = req.body;
        const updatedArtPiece = await prisma.artWork.update({
            where: { id },
            data: artData
        });
        res.json(updatedArtPiece);
    } catch (error) {
        console.error('Error updating art piece:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/art-feed/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.artWork.delete({
            where: { id }
        });
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting art piece:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port: http://localhost:${port}`);
});
