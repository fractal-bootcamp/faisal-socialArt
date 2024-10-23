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
        sidebarDefaultOpen: { control: 'boolean' },
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
    }));
};

export const Default: Story = {
    args: {
        initialItems: generateRandomFeedItems(5),
        userName: "Michael Scott",
        userAvatar: "https://github.com/shadcn.png",
        companyName: "Jammin' Art",
        sidebarDefaultOpen: true,
    },
};

export const EmptyFeed: Story = {
    args: {
        initialItems: [],
        userName: "Dwight Schrute",
        userAvatar: "",
        companyName: "Dunder Mifflin",
        sidebarDefaultOpen: true,
    },
};

export const CustomUser: Story = {
    args: {
        initialItems: generateRandomFeedItems(3),
        userName: "Jim Halpert",
        userAvatar: "https://example.com/jim.jpg",
        companyName: "Dunder Mifflin",
        sidebarDefaultOpen: true,
    },
};
