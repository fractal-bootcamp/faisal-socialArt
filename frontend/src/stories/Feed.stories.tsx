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
export const FeedWithThreeItems: Story = {
    args: {
        userName: 'Michael Scott',
        userAvatar: 'https://github.com/shadcn.png',
        displayAsGrid: false,
    },
    // Use the loaders property to set up initial data
    loaders: [
        async () => ({
            feedItems: [
                generateRandomFeedItem('1'),
                generateRandomFeedItem('2'),
                generateRandomFeedItem('3'),
            ],
        }),
    ],
};

// Add a story for grid display
export const GridFeed: Story = {
    args: {
        ...FeedWithThreeItems.args,
        displayAsGrid: true,
    },
    loaders: FeedWithThreeItems.loaders,
};