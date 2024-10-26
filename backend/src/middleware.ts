import { Request, Response, NextFunction } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    console.log('=== authMiddleware called ===');
    console.log('Request path:', req.path);
    const { userId } = getAuth(req)
    console.log('userId:', userId);
    if (!userId) {
        res.status(500).json({ error: "User not logged in" })
        return;
    }

    const clerkUser = await clerkClient.users.getUser(userId)
    // Find user by clerkUserId
    let user = await prisma.user.findUnique({
        where: { clerkUserId: userId }
    })

    if (!user) {
        // If user doesn't exist, create a new one
        user = await prisma.user.create({
            data: {
                clerkUserId: userId,
                email: clerkUser?.primaryEmailAddress?.emailAddress ?? '',
                username: clerkUser?.username ?? '',
                firstName: clerkUser?.firstName ?? '',
                lastName: clerkUser?.lastName ?? '',
            },
        })
    }

    (req as Request & { user: any }).user = user;
    next();
}
