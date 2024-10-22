// in here are all the functions that generate the art DATA
// and also all the multiple types (arrays, maps, etc...) that are used to manage the art data internally.
// and any functions for sorting, filtering, or otherwise re-organizing the art data.
// everything in here should be a pure function.
// this is where the TYPES for the art should be exported.
// updating (e.g. calculating the NEXT STATE given current state and an input) the art data should be done through these functions.

import { v4 as uuidv4 } from 'uuid';

export type ArtFeed = ArtWork[];

export type ArtStyle = "line" | "circle";

export type Color = "colorA" | "colorB";

export type ArtType = ArtWork;

export interface ArtWork {
    id: string;
    userName: string;
    isAuthor: boolean;
    colorA: { h: number; s: number; b: number };
    colorB: { h: number; s: number; b: number };
    stripeCount: number;
    style: ArtStyle;
}

export function updateColor(art: ArtWork, color: Color, hsb: { h: number, s: number, b: number }): ArtWork {
    const safeH = Math.floor(Math.max(0, Math.min(360, hsb.h)));
    const safeSB = [hsb.s, hsb.b].map(value => Math.floor(Math.max(0, Math.min(100, value))));
    return { ...art, [color]: { h: safeH, s: safeSB[0], b: safeSB[1] } };
}

export function updateFeed(art: ArtWork, artFeed: ArtFeed): ArtFeed {
    // Find the index of an existing art piece with the same id, if it exists
    const existingIndex = artFeed.findIndex(item => item.id === art.id);

    if (existingIndex !== -1) {
        // If the art piece exists, update it
        const updatedFeed = [...artFeed];
        updatedFeed[existingIndex] = art;
        return updatedFeed;
    } else {
        // If it's a new art piece, add it to the beginning of the feed
        return [art, ...artFeed];
    }
}

export function generateRandomArt(): ArtWork {
    return {
        id: uuidv4(),
        userName: "", // Adding userName
        isAuthor: false, // Adding isAuthor
        colorA: {
            h: Math.floor(Math.random() * 361),
            s: Math.floor(Math.random() * 101),
            b: Math.floor(Math.random() * 101)
        },
        colorB: {
            h: Math.floor(Math.random() * 361),
            s: Math.floor(Math.random() * 101),
            b: Math.floor(Math.random() * 101)
        },
        stripeCount: Math.floor(Math.random() * 49) + 2, // Random number between 2 and 50
        style: Math.random() < 0.5 ? "line" : "circle"
    };
}