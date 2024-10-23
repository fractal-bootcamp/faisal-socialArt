import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import FeedPage from '../components/web-pages/FeedPage';
import { ArtType, generateRandomArt } from '@/services/artService';

const meta: Meta<typeof FeedPage> = {
    title: 'Pages/FeedPage',
    component: FeedPage,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        initialItems: { control: 'object' },
        userName: { control: 'text' },
        userAvatar: { control: 'text' },
    },
    // Wrap the component in BrowserRouter
    decorators: [
        (Story) => (
            <BrowserRouter>
                <Story />
            </BrowserRouter>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof FeedPage>;

const generateRandomFeedItems = (count: number): ArtType[] => {
    return Array.from({ length: count }, (_, index) => ({
        ...generateRandomArt(),
        id: `${index + 1}`,
        likeCount: Math.floor(Math.random() * 100), // Random like count between 0 and 99
    }));
};

export const Default: Story = {
    args: {
        initialItems: generateRandomFeedItems(5),
        userName: "Michael Scott",
        userAvatar: "https://github.com/shadcn.png",
    },
};

export const EmptyFeed: Story = {
    args: {
        initialItems: [],
        userName: "Dwight Schrute",
        userAvatar: "",
    },
};