import type { Meta, StoryObj } from '@storybook/react';
import Feed from '../components/Feed';
import { ArtType, generateRandomArt } from '@/services/artService';

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
    },
};

export default meta;
type Story = StoryObj<typeof Feed>;

interface FeedItem extends ArtType {
    userName: string;
    userAvatar: string;
    isAuthor: boolean;
}

const generateRandomFeedItem = (id: string, userName: string, userAvatar: string, isAuthor: boolean): FeedItem => ({
    ...generateRandomArt(),
    id,
    userName,
    userAvatar,
    isAuthor,
});

export const EmptyFeed: Story = {
    args: {
        initialItems: [],
    },
};

export const FeedWithThreeItems: Story = {
    args: {
        initialItems: [
            generateRandomFeedItem('1', 'Michael Scott', 'https://github.com/shadcn.png', true),
            generateRandomFeedItem('2', 'Dwight Schrute', '', false),
            generateRandomFeedItem('3', 'Jim Halpert', '', false),
        ],
    },
};