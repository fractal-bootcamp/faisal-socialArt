import type { Meta, StoryObj } from '@storybook/react';
import ProfilePage from '../components/web-pages/ProfilePage';
import { ArtType, generateRandomArt } from '@/services/artService';

const meta: Meta<typeof ProfilePage> = {
    title: 'Pages/ProfilePage',
    component: ProfilePage,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        userArts: { control: 'object' },
        userName: { control: 'text' },
        userAvatar: { control: 'text' },
        companyName: { control: 'text' },
        sidebarDefaultOpen: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof ProfilePage>;

const generateRandomUserArts = (count: number): ArtType[] => {
    return Array.from({ length: count }, (_, index) => ({
        ...generateRandomArt(),
        id: `${index + 1}`,
    }));
};

export const Default: Story = {
    args: {
        userArts: generateRandomUserArts(6),
        userName: "Michael Scott",
        userAvatar: "https://github.com/shadcn.png",
        companyName: "Jammin' Art",
        sidebarDefaultOpen: true,
    },
};

export const EmptyGallery: Story = {
    args: {
        userArts: [],
        userName: "Dwight Schrute",
        userAvatar: "",
        companyName: "Schrute Farms",
        sidebarDefaultOpen: true,
    },
};