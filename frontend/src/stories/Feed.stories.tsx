import type { Meta, StoryObj } from '@storybook/react';
import Feed from '../components/art-components/Feed';
import { ArtType, generateRandomArt } from '@/services/artService';

// Define the meta object for the Feed component
const meta: Meta<typeof Feed> = {
    title: 'Components/Feed',
    component: Feed,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        initialItems: {
            control: 'object',
            description: 'Array of initial feed items',
        },
        userName: { control: 'text' },
        userAvatar: { control: 'text' },
        displayAsGrid: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof Feed>;

// Helper function to generate random feed items
const generateRandomFeedItem = (id: string): ArtType => ({
    ...generateRandomArt(),
    id,
});

// Define stories for the Feed component
export const EmptyFeed: Story = {
    args: {
        initialItems: [],
        userName: 'Michael Scott',
        userAvatar: 'https://github.com/shadcn.png',
        displayAsGrid: false,
    },
};

export const FeedWithThreeItems: Story = {
    args: {
        initialItems: [
            generateRandomFeedItem('1'),
            generateRandomFeedItem('2'),
            generateRandomFeedItem('3'),
        ],
        userName: 'Michael Scott',
        userAvatar: 'https://github.com/shadcn.png',
        displayAsGrid: false,
    },
};

// Add a story for grid display
export const GridFeed: Story = {
    args: {
        ...FeedWithThreeItems.args,
        displayAsGrid: true,
    },
};