import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

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
        res.status(200)
            .json({ message: 'Fetching art feed...', data: artFeed });
    } catch (error) {
        console.error('Error fetching art feed:', error);
        res.status(500)
            .json({ error: 'Internal server error.' });
    }
});

app.get('/api/art-feed/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const artWork = await prisma.artWork.findUnique({
            where: { id }
        });
        if (!artWork) {
            return res.status(404).json({ error: 'Art work not found.' });
        }
        res.status(200)
            .json({ message: 'Fetching art work...', data: artWork });
    } catch (error) {
        console.error('Error fetching art work:', error);
        res.status(500)
            .json({ error: 'Internal server error.' });
    }
});

app.post('/api/art-feed', async (req: Request, res: Response) => {
    try {
        const artData = req.body;
        // Convert the incoming data to match the Prisma schema
        const prismaArtData = {
            configuration: artData,
            authorId: artData.authorId // Assuming the authorId is provided in the request
        };
        const newArtWork = await prisma.artWork.create({
            data: prismaArtData
        });
        res.status(201)
            .json({ message: 'Created art work...', data: newArtWork });
    } catch (error) {
        console.error('Error creating art work:', error);
        res.status(500)
            .json({ error: 'Internal server error.' });
    }
});

app.put('/api/art-feed/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const artData = req.body;
        // Convert the incoming data to match the Prisma schema
        const prismaArtData = {
            configuration: artData
        };
        const updatedArtWork = await prisma.artWork.update({
            where: { id },
            data: prismaArtData
        });
        res.status(200)
            .json({ message: 'Updated art work...', data: updatedArtWork });
    } catch (error) {
        console.error('Error updating art work:', error);
        res.status(500)
            .json({ error: 'Internal server error' });
    }
});

app.delete('/api/art-feed/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.artWork.delete({
            where: { id }
        });
        res.status(200)
            .json({ message: 'Deleted art work...' });
    } catch (error) {
        console.error('Error deleting art work:', error);
        res.status(500)
            .json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port: http://localhost:${port}`);
});