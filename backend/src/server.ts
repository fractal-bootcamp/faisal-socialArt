import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { clerkMiddleware, requireAuth, clerkClient, getAuth } from '@clerk/express';
import { getArtFeed, getPrismaArtFromDTO } from './services/artService';
import { ArtWorkSchema } from '../../common/schemas';

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

const user = (req: Request) => (req as any).user;

// Custom middleware for checking user existence in database
const verifyUserInDatabase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userId } = getAuth(req);
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized access.' });
        return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
        res.status(404).json({ error: 'User not found in database.' });
        return;
    }
    // Attach user to request object
    (req as any).user = user;
    return next();
};

// Routes
app.get('/', (_req, res) => {
    res.send("Hello, let's jam some art with Jammin'!");
});

app.get('/api/users', async (_req: Request, res: Response) => {
    const users = await clerkClient.users.getUserList();
    res.json(users);
});

app.get("/protected", requireAuth(), verifyUserInDatabase, (req: Request, res: Response) => {
    // User is now available on req as any due to custom middleware
    res.json({ user });
});

app.get('/api/art-feed', async (_req: Request, res: Response) => {
    const artWorks = await getArtFeed();
    res.status(200).json(artWorks);
});

app.get('/api/art-feed/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    const artWork = await prisma.artWork.findUnique({
        where: { id }
    });

    if (!artWork) {
        res.status(404).json({ error: 'Art work not found.' });
        return;
    }
    res.status(200).json(artWork);
});

app.post('/api/art-feed', requireAuth(), verifyUserInDatabase, async (req: Request, res: Response) => {
    const artData = req.body;
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

app.post("/api/art-feed/:id/like", requireAuth(), verifyUserInDatabase, async (req: Request, res: Response) => {
    const { id: artWorkId } = req.params;
    const { isLiked } = req.body;

    // Validate artwork exists
    const artwork = await prisma.artWork.findUnique({ where: { id: artWorkId } });

    if (!artwork) {
        res.status(404).json({ error: 'Artwork not found.' });
        return;
    }

    if (isLiked) {
        // Add like
        await prisma.like.create({
            data: { userId: user(req).id, artWorkId: artWorkId }
        });
    } else {
        // Remove like
        await prisma.like.delete({
            where: {
                userId_artWorkId: {
                    userId: user(req).id,
                    artWorkId: artWorkId
                }
            }
        });
    }

    // Fetch and update artwork with new like count
    const updatedArtwork = await prisma.artWork.findUnique({
        where: { id: artWorkId },
        include: { likes: true }
    });
    res.status(200).json({ likeCount: updatedArtwork?.likes.length || 0 });
});

app.put('/api/art-feed/:id', requireAuth(), verifyUserInDatabase, async (req: Request, res: Response) => {
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
});

app.delete('/api/art-feed/:id', requireAuth(), verifyUserInDatabase, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        console.log(`Attempting to delete art with ID: ${id}`);

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

app.get('/api/profile/:userName', async (req: Request, res: Response) => {
    try {
        const { userName } = req.params;
        console.log(`Attempting to fetch profile for user: ${userName}`);

        const userProfile = await prisma.user.findUnique({
            where: { username: userName },
            include: {
                artWorks: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!userProfile) {
            console.log(`User not found: ${userName}`);
            res.status(404).json({ error: 'User not found.' });
            return;
        }

        const { id, username, artWorks } = userProfile;

        console.log({ message: 'Fetching user profile and artwork...', data: { id, username, artWorks } });
        res.status(200).json({ id, username, artWorks });
    } catch (error) {
        console.error('Error fetching user profile and artwork:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`);
});
