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
    style: z.enum(['line', 'circle'])
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
    isAuthor: z.boolean()
});

// Define the ArtWorkDTOSchema with transform
export const ArtWorkDTOSchema = DBArtWorkSchema.transform((art) => ({
    id: art.id,
    userAvatar: art.author.avatar ?? "",
    userName: art.author.username,
    isAuthor: true,
    authorId: art.authorId,
    colorA: art.configuration.colorA,
    colorB: art.configuration.colorB,
    stripeCount: art.configuration.stripeCount,
    style: art.configuration.style
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
    isAuthor: dto.isAuthor
}));