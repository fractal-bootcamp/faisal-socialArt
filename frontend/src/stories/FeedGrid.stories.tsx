import type { Meta, StoryObj } from '@storybook/react';
import FeedGrid from '../components/art-components/FeedGrid';
import { ArtType, generateRandomArt } from '@/services/artService';

// Define the meta object for the FeedGrid component
const meta: Meta<typeof FeedGrid> = {
    title: 'Components/FeedGrid',
    component: FeedGrid,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        initialItems: {
            control: 'object',
            description: 'Array of initial feed items',
        },
        userName: { control: 'text' },
        userAvatar: { control: 'text' },
        isProfilePage: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof FeedGrid>;

// Helper function to generate random feed items
const generateRandomFeedItems = (count: number): ArtType[] => {
    return Array.from({ length: count }, (_, index) => ({
        ...generateRandomArt(),
        id: `${index + 1}`,
        likeCount: Math.floor(Math.random() * 100), // Random like count between 0 and 99
    }));
};

// Define stories for the FeedGrid component
export const EmptyFeedGrid: Story = {
    args: {
        initialItems: [],
        userName: 'Michael Scott',
        userAvatar: 'https://github.com/shadcn.png',
        isProfilePage: true,
    },
};

export const FeedGridWithItems: Story = {
    args: {
        initialItems: generateRandomFeedItems(8),
        userName: 'Michael Scott',
        userAvatar: 'https://github.com/shadcn.png',
        isProfilePage: true,
    },
};