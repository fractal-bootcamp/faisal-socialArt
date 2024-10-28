import { z } from 'zod';

// Define the ArtWork schema
export const ArtWorkSchema = z.object({
    id: z.string().optional(),
    userAvatar: z.string().optional(),
    userName: z.string().optional(),
    isAuthor: z.boolean().optional(),
    authorId: z.string(),
    colorA: z.object({
        h: z.number(),
        s: z.number(),
        b: z.number()
    }),
    colorB: z.object({
        h: z.number(),
        s: z.number(),
        b: z.number()
    }),
    stripeCount: z.number(),
    style: z.enum(['line', 'circle']),
    likeCount: z.number().optional()
});

// Define the PrismaArtWork schema
export const DBArtWorkSchema = z.object({
    id: z.string(),
    configuration: z.object({
        colorA: z.object({
            h: z.number(),
            s: z.number(),
            b: z.number()
        }),
        colorB: z.object({
            h: z.number(),
            s: z.number(),
            b: z.number()
        }),
        stripeCount: z.number(),
        style: z.enum(['line', 'circle'])
    }),
    author: z.object({
        id: z.string(),
        avatar: z.string().nullable(),
        username: z.string()
    }),
    authorId: z.string(),
    userAvatar: z.string(),
    userName: z.string(),
    isAuthor: z.boolean(),
    likeCount: z.number().optional()
});

// Define the ArtWorkDTOSchema with transform
export const ArtWorkDTOSchema = DBArtWorkSchema.transform((dbArt) => ({
    id: dbArt.id,
    userAvatar: dbArt.author.avatar || '',
    userName: dbArt.author.username,
    isAuthor: true,
    authorId: dbArt.authorId,
    colorA: dbArt.configuration.colorA,
    colorB: dbArt.configuration.colorB,
    stripeCount: dbArt.configuration.stripeCount,
    style: dbArt.configuration.style,
    likeCount: dbArt.likeCount
}));

// Define the PrismaArtFromDTOSchema with transform
// Example usage:
// const artDTO = {
//     id: '123',
//     userAvatar: 'avatar.jpg',
//     userName: 'John Doe',
//     isAuthor: true,
//     authorId: 'user123',
//     colorA: { h: 180, s: 50, b: 75 },
//     colorB: { h: 240, s: 60, b: 80 },
//     stripeCount: 5,
//     style: 'line'
// };
// const prismaArt = PrismaArtFromDTOSchema.parse(artDTO);
// console.log(prismaArt);
// Output: {
//     configuration: {
//         colorA: { h: 180, s: 50, b: 75 },
//         colorB: { h: 240, s: 60, b: 80 },
//         stripeCount: 5,
//         style: 'line'
//     },
//     author: { connect: { id: 'user123' } },
//     userAvatar: 'avatar.jpg',
//     userName: 'John Doe',
//     isAuthor: true
// }
export const PrismaArtFromDTOSchema = ArtWorkSchema.transform((dto) => ({
    configuration: {
        colorA: dto.colorA,
        colorB: dto.colorB,
        stripeCount: dto.stripeCount,
        style: dto.style
    },
    author: {
        connect: {
            id: dto.authorId
        }
    },
    userAvatar: dto.userAvatar,
    userName: dto.userName,
    isAuthor: dto.isAuthor,
    likeCount: dto.likeCount
}));

// Add a schema for transforming frontend data to backend format
export const BackendArtSchema = ArtWorkSchema.transform((frontendArt) => ({
    configuration: {
        colorA: frontendArt.colorA,
        colorB: frontendArt.colorB,
        stripeCount: frontendArt.stripeCount,
        style: frontendArt.style
    },
    authorId: frontendArt.authorId,
    userAvatar: frontendArt.userAvatar,
    userName: frontendArt.userName,
    isAuthor: frontendArt.isAuthor,
    likeCount: frontendArt.likeCount
}));