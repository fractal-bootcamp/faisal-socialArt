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
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post("/api/art-feed/:id/like", async (req: Request, res: Response) => {
    try {
        const { id: artWorkId } = req.params;
        const { userId, isLiked } = req.body;

        // Validate user exists
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Validate artwork exists
        const artwork = await prisma.artWork.findUnique({ where: { id: artWorkId } });
        if (!artwork) {
            return res.status(404).json({ error: 'Artwork not found.' });
        }

        if (isLiked) {
            await prisma.like.upsert({
                where: {
                    userId_artWorkId: {
                        userId: userId,
                        artWorkId: artWorkId
                    }
                },
                update: {},
                create: { userId: userId, artWorkId: artWorkId }
            });
        } else {
            // Remove like
            await prisma.like.delete({
                where: {
                    userId_artWorkId: {
                        userId: userId,
                        artWorkId: artWorkId
                    }
                }
            });
        }
        const updatedArtwork = await prisma.artWork.findUnique({
            where: { id: artWorkId },
            include: { likes: true }
        });
        res.status(200).json({ likeCount: updatedArtwork?.likes.length || 0 });
    } catch (error) {
        console.error('Error updating like:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/art-feed/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const artData = req.body;

        const updatedArtWork = await prisma.artWork.update({
            where: { id },
            data: {
                configuration: artData,
                userAvatar: artData.userAvatar,
                userName: artData.userName,
                isAuthor: artData.isAuthor,
                authorId: artData.authorId
            }
        });

        res.status(200).json(updatedArtWork);
    } catch (error) {
        console.error('Error updating art work:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/art-feed/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        console.log(`Attempting to delete art with ID: ${id}`);

        // Use Prisma to delete the artwork
        const deletedArt = await prisma.artWork.delete({
            where: { id: id }
        });

        console.log(`Delete result:`, deletedArt);
        res.status(200).json({ message: 'Art deleted successfully', deletedArt });
    } catch (error) {
        console.error('Error in delete operation:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.delete('/api/art-feed/:id/like', async (req: Request, res: Response) => {
    try {
        const { id: artWorkId } = req.params;
        const { userId } = req.body;

        // Validate user exists
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Validate artwork exists
        const artwork = await prisma.artWork.findUnique({
            where: { id: artWorkId }
        });
        if (!artwork) {
            return res.status(404).json({ error: 'Artwork not found.' });
        }

        // Remove like
        await prisma.like.delete({
            where: {
                userId_artWorkId: {
                    userId: userId,
                    artWorkId: artWorkId
                }
            }
        });

        // Fetch and update artwork with new like count
        const updatedArtwork = await prisma.artWork.findUnique({
            where: { id: artWorkId },
            include: { likes: true }
        });
        res.status(200).json({ likeCount: updatedArtwork?.likes.length || 0 });
    } catch (error) {
        console.error('Error in delete like operation:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
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
        const { id, username, artWorks } = userProfile;

        console.log({ message: 'Fetching user profile and artwork...', data: { id, username, artWorks } });
        res.status(200).json({ id, username, artWorks });
    } catch (error) {
        console.error('Error fetching user profile and artwork:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port: http://localhost:${port}`);
});
