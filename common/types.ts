
import { z } from 'zod';
import { ArtWorkSchema } from './schemas';

export type ArtWork = z.infer<typeof ArtWorkSchema>;
