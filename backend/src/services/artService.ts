import { Prisma, PrismaClient } from "@prisma/client";
import { ArtWork } from "../../../common/types";

const prisma = new PrismaClient();

type ArtStyle = "line" | "circle";

export type ArtWorkData = {
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

type PrismaArtWork = Prisma.ArtWorkGetPayload<{
    include: {
        author: true
    }
}>

export type DBArtConfiguration = PrismaArtWork["configuration"]

export type ArtConfigurationInDB = {
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

export function getPrismaArtFromDTO(dto: ArtWork): Prisma.ArtWorkCreateInput {
    return {
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
        // userAvatar: dto.userAvatar,
        // userName: dto.userName,
        // isAuthor: dto.isAuthor
    };
}

// DTO = Data Transfer Object
export function getArtDTO(art: PrismaArtWork): ArtWork {
    // Convert the configuration JsonValue to ArtConfigurationInDB
    const config = art.configuration as ArtConfigurationInDB;

    const newArtWork: ArtWork = {
        id: art.id,
        userAvatar: art.author.avatar ?? "",
        userName: art.author.username,
        isAuthor: true,
        authorId: art.authorId,
        colorA: config.colorA,
        colorB: config.colorB,
        stripeCount: config.stripeCount,
        style: config.style,
    };

    return newArtWork;
}


export async function getArtFeed() {

    const dbArts = await prisma.artWork.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            author: true,
            likes: true
        }
    });

    const artFeed = dbArts.map(dbArt => ({
        ...getArtDTO(dbArt),
        likeCount: dbArt.likes.length
    }));
    return artFeed;
}