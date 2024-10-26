import { Request, Response, NextFunction } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { PrismaClient } from "@prisma/client";
import type { User } from '@prisma/client';

// Define the extended request type
export interface AuthenticatedRequest extends Request {
    user: User;  // Make user optional
}

const prisma = new PrismaClient()

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const clerkUser = await clerkClient.users.getUser(userId);
        let user = await prisma.user.findUnique({
            where: { clerkId: userId }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    clerkId: userId,
                    email: clerkUser?.primaryEmailAddress?.emailAddress ?? '',
                    username: clerkUser?.username ?? '',
                    firstName: clerkUser?.firstName ?? '',
                    lastName: clerkUser?.lastName ?? '',
                },
            });
        }

        (req as AuthenticatedRequest).user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
};
