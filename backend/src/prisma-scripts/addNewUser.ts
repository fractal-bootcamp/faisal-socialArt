import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create new user as requested
const user3 = await prisma.user.create({
    data: {
        email: 'faisal@example.com',
        username: 'Faisalowimer',
        firstName: 'Faisal',
        lastName: 'Owimer',
        avatar: 'https://github.com/faisalowimer.png',
    },
})