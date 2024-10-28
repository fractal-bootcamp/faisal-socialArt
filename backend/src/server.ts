import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { clerkMiddleware, requireAuth, clerkClient, getAuth } from '@clerk/express';
import { getArtFeed, getPrismaArtFromDTO, getArtDTO } from './services/artService';
import { ArtWorkSchema } from '../../common/schemas';
import { authMiddleware, AuthenticatedRequest } from './middleware';


const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

// Middleware
console.log('Setting up middleware...');
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
console.log('Middleware setup complete.');

// Public routes (no auth required)
console.log('Setting up public routes...');
app.get('/', (_req: Request, res: Response) => {
    console.log('Handling root route...');
    res.send("Hello, let's jam some art with Jammin'!");
    console.log('Root route handled.');
});

app.get('/api/users', async (_req: Request, res: Response) => {
    console.log('Fetching users...');
    const users = await clerkClient.users.getUserList();
    console.log(`Fetched ${users.totalCount} users.`);
    res.json(users);
});

app.get("/protected", requireAuth(), (req: Request, res: Response) => {
    console.log('Handling protected route...');
    const user = (req as Request & { user: any }).user;
    console.log('User authenticated:', user);
    res.json({ user });
});

app.get('/api/art-feed', async (_req: Request, res: Response) => {
    console.log('Fetching art feed...');
    const artWorks = await getArtFeed();
    console.log(`Fetched ${artWorks.length} artworks.`);
    res.status(200).json(artWorks);
});

app.get('/api/art-feed/:id', async (req: Request, res: Response) => {
    console.log('Fetching specific artwork...');
    const { id } = req.params;
    console.log(`Artwork ID: ${id}`);

    const artWork = await prisma.artWork.findUnique({
        where: { id }
    });

    if (!artWork) {
        console.log('Artwork not found.');
        res.status(404).json({ error: 'Art work not found.' });
        return;
    }
    console.log('Artwork found:', artWork);
    res.status(200).json(artWork);
});

console.log('Public routes setup complete.');

// Protected routes (auth required)
console.log('Setting up protected routes...');
// Add authMiddleware to individual protected routes
app.post('/api/art-feed', clerkMiddleware(), authMiddleware, async (req: Request, res: Response) => {
    console.log('Creating new artwork...');
    const { user } = req as AuthenticatedRequest;
    console.log('User:', user);

    const artData = req.body;
    console.log('Received art data:', artData);
    const validatedArtData = ArtWorkSchema.parse(artData);
    console.log('Validated art data:', validatedArtData);

    // Use the user information to set the author of the artwork
    console.log('Creating artwork in database...');
    const newArtWork = await prisma.artWork.create({
        data: {
            ...getPrismaArtFromDTO(validatedArtData),
            author: {
                connect: {
                    clerkId: user.clerkId // Connect the artwork to the user using clerkId
                }
            },
        },
        include: {
            author: true
        }
    });

    console.log('Created art work:', newArtWork);
    res.status(201).json(newArtWork);
});

app.post("/api/art-feed/:id/like", clerkMiddleware(), authMiddleware, async (req: Request, res: Response) => {
    console.log('Handling like/unlike request...');
    const { user } = req as AuthenticatedRequest;
    const { id: artWorkId } = req.params;
    const { isLiked } = req.body;
    console.log(`User: ${user.username}, ArtworkID: ${artWorkId}, isLiked: ${isLiked}`);

    try {
        // First check if the like already exists
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_artWorkId: {
                    userId: user.clerkId,
                    artWorkId: artWorkId
                }
            }
        });

        if (isLiked && !existingLike) {
            // Create like if it doesn't exist
            await prisma.like.create({
                data: {
                    userId: user.clerkId,
                    artWorkId: artWorkId
                }
            });
        } else if (!isLiked && existingLike) {
            // Delete like if it exists
            await prisma.like.delete({
                where: {
                    userId_artWorkId: {
                        userId: user.clerkId,
                        artWorkId: artWorkId
                    }
                }
            });
        }

        // Fetch updated artwork with like count and user's like status
        const updatedArtwork = await prisma.artWork.findUnique({
            where: { id: artWorkId },
            include: {
                likes: true
            }
        });

        if (!updatedArtwork) {
            return res.status(404).json({ error: 'Artwork not found.' });
        }

        const isLikedByUser = updatedArtwork.likes.some(like => like.userId === user.clerkId);

        res.status(200).json({
            likeCount: updatedArtwork.likes.length,
            isLikedByUser
        });
    } catch (error) {
        console.error('Error handling like:', error);
        res.status(500).json({ error: 'Failed to update like status' });
    }
});

app.put('/api/art-feed/:id', clerkMiddleware(), authMiddleware, async (req: Request, res: Response) => {
    console.log('Updating artwork...');
    const { user } = req as AuthenticatedRequest;
    const { id } = req.params;
    const artData = req.body;
    console.log(`User: ${user.username}, ArtworkID: ${id}`);
    console.log('Received art data:', artData);

    // Validate that the user is the author of the artwork
    console.log('Validating user ownership...');
    const existingArtWork = await prisma.artWork.findUnique({
        where: { id },
        include: { author: true }
    });

    if (!existingArtWork || existingArtWork.authorId !== user.clerkId) {
        console.log('Unauthorized update attempt.');
        return res.status(403).json({ error: 'Unauthorized to update this artwork' });
    }

    // Update the artwork with user information
    console.log('Updating artwork in database...');
    const updatedArtWork = await prisma.artWork.update({
        where: { id },
        data: {
            configuration: artData.configuration,
        },
        include: { author: true } // Include author information in the response
    });

    console.log('Updated artwork:', updatedArtWork);
    res.status(200).json(updatedArtWork);
});

app.delete('/api/art-feed/:id', clerkMiddleware(), authMiddleware, async (req: Request, res: Response) => {
    console.log('Deleting artwork...');
    const { user } = req as AuthenticatedRequest;
    try {
        const { id } = req.params;
        console.log(`Attempting to delete art with ID: ${id} for user: ${user.username}`);

        // Check if the artwork belongs to the user
        console.log('Validating user ownership...');
        const artwork = await prisma.artWork.findUnique({
            where: { id: id }
        });

        if (!artwork || artwork.authorId !== user.clerkId) {
            console.log('Unauthorized delete attempt.');
            return res.status(403).json({ message: 'Unauthorized to delete this artwork' });
        }

        console.log('Deleting artwork from database...');
        const deletedArt = await prisma.artWork.delete({
            where: { id: id }
        });

        console.log(`Delete result for user ${user.username}:`, deletedArt);
        res.status(200).json({ message: 'Art deleted successfully', deletedArt });
    } catch (error) {
        console.error(`Error in delete operation for user ${user.username}:`, error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.get('/api/profile/:userName', async (req: Request, res: Response) => {
    console.log('Fetching user profile...');
    try {
        const { userName } = req.params;
        // Normalize the username to match the database
        const normalizedUserName = userName.toLowerCase();

        // First find the user in the database by username
        const userProfile = await prisma.user.findFirst({
            where: {
                username: {
                    equals: normalizedUserName,
                    mode: 'insensitive' // This makes the search case-insensitive
                }
            },
            include: {
                artWorks: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        likes: true,
                        author: true
                    }
                }
            }
        });

        if (!userProfile) {
            console.log(`User not found: ${userName}`);
            res.status(404).json({ error: 'User not found.' });
            return;
        }

        const artWorksWithLikes = userProfile.artWorks.map(art => getArtDTO(art));
        res.status(200).json(artWorksWithLikes);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

console.log('Protected routes setup complete.');

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`);
});
