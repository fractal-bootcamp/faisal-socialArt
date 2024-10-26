import { z } from 'zod';
import { ArtWorkSchema } from './schemas';

// Define ArtWork type using Zod schema
export type ArtWork = z.infer<typeof ArtWorkSchema>;
