import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { clerkMiddleware, requireAuth, clerkClient, getAuth } from '@clerk/express';
import { getArtFeed, getPrismaArtFromDTO } from './services/artService';
import { ArtWorkSchema } from '../../common/schemas';

const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.get('/', (_req, res) => {
    res.send("Hello, let's jam some art with Jammin'!");
});

app.get("/protected", requireAuth({ signInUrl: "/sign-in" }), async (req: Request, res: Response) => {
    try {
        // Cast req to any to access auth property
        const { userId } = (req as any).auth;
        const user = await clerkClient.users.getUser(userId);
        res.json({ user });
    } catch (error) {
        console.error('Error in protected route:', error);
        res.status(401).json({ error: "Unauthorized access." });
    }
});

app.get('/api/art-feed', async (_req: Request, res: Response) => {
    const artWorks = await getArtFeed();
    res.status(200).json(artWorks);
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

app.post('/api/art-feed', requireAuth(), async (req: Request, res: Response) => {
    const { userId } = (req as any).auth;
    const artData = req.body;
    // USE ZOD TO VALIDATE UNKNOWN DATA FROM OVER THE WIRE.
    // in this case the client.
    const validatedArtData = ArtWorkSchema.parse(artData);

    const newArtWork = await prisma.artWork.create({
        data: getPrismaArtFromDTO(validatedArtData),
        include: {
            author: true
        }
    });

    console.log({ message: 'Created art work...', data: newArtWork });
    res.status(201).json(newArtWork);
});

app.post("/api/art-feed/:id/like", requireAuth(), async (req: Request, res: Response) => {
    const { userId } = getAuth(req);
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized access.' });
    }
    try {
        const { id: artWorkId } = req.params;
        const { isLiked } = req.body;

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
