import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

type ArtStyle = "line" | "circle";

type ArtWorkData = {
    id: string;
    userAvatar: string;
    userName: string;
    isAuthor: boolean;
    authorId: string;
    colorA: { h: number, s: number, b: number };
    colorB: { h: number, s: number, b: number };
    stripeCount: number;
    style: ArtStyle;
}

type ArtConfigurationInDB = {
    colorA: {
        h: number;
        s: number;
        b: number;
    };
    colorB: {
        h: number;
        s: number;
        b: number;
    };
    stripeCount: number;
    style: ArtStyle;
}

const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (_req, res) => {
    res.send("Hello, let's jam some art with Jammin'!");
});

app.get('/api/art-feed', async (_req: Request, res: Response) => {
    try {
        const artFeed = await prisma.artWork.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                author: true
            }
        });

        const artWorks = artFeed.map((art) => {
            // Convert the configuration JsonValue to ArtConfigurationInDB
            const config = art.configuration as ArtConfigurationInDB;

            return {
                id: art.id,
                userAvatar: art.author.avatar,
                userName: art.author.username,
                isAuthor: true,
                authorId: art.authorId,
                colorA: config.colorA,
                colorB: config.colorB,
                stripeCount: config.stripeCount,
                style: config.style
            };
        });

        res.status(200)
        console.log({ message: 'Fetching art feed...', data: artWorks });
        res.status(200).json(artWorks);
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
        console.log({ message: 'Fetching art work...', data: artWork });
        res.status(200).json(artWork);
    } catch (error) {
        console.error('Error fetching art work:', error);
        res.status(500)
            .json({ error: 'Internal server error.' });
    }
});

app.post('/api/art-feed', async (req: Request, res: Response) => {
    try {
        const artData = req.body as ArtWorkData;

        // Validate required fields
        if (!artData.authorId) {
            return res.status(400).json({ error: 'authorId is required' });
        }

        // Ensure configuration fields are present
        if (!artData.colorA || !artData.colorB || !artData.stripeCount || !artData.style) {
            return res.status(400).json({ error: 'Missing required configuration fields' });
        }

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

        const newArtWork = await prisma.artWork.create({
            data: prismaArtData,
            include: {
                author: true
            }
        });

        console.log({ message: 'Created art work...', data: newArtWork });
        res.status(201).json(newArtWork);
    } catch (error) {
        console.error('Error creating art work:', error);

        // Provide more detailed error information
        if (error instanceof Error) {
            res.status(500).json({
                error: 'Internal server error',
                message: error.message,
            });
        } else {
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
});

app.put('/api/art-feed/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const artData = req.body; // this bad. use ZOD to validate the data every time. for the rest of your life.
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

// New route to get user profile and their artwork
app.get('/api/profile/:userName', async (req: Request, res: Response) => {
    try {
        const { userName } = req.params;
        console.log(`Attempting to fetch profile for user: ${userName}`); // Log the username being queried

        // Fetch user profile and their artwork
        const userProfile = await prisma.user.findUnique({
            where: { username: userName },
            include: {
                artWorks: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        console.log('Query result:', userProfile); // Log the entire query result

        if (!userProfile) {
            console.log(`User not found: ${userName}`); // Log when user is not found
            return res.status(404).json({ error: 'User not found.' });
        }

        // Remove sensitive information like password before sending the response
        const { ...safeUserProfile } = userProfile;

        console.log({ message: 'Fetching user profile and artwork...', data: safeUserProfile });
        res.status(200).json(safeUserProfile);
    } catch (error) {
        console.error('Error fetching user profile and artwork:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port: http://localhost:${port}`);
});
