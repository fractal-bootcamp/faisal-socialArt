import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
    // Wrap the component in BrowserRouter with a proper route
    decorators: [
        (Story) => (
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Story />} />
                </Routes>
            </BrowserRouter>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof ProfilePage>;

// Function to generate random user arts
const generateRandomUserArts = (count: number): ArtType[] => {
    return Array.from({ length: count }, (_, index) => ({
        ...generateRandomArt(),
        id: `${index + 1}`,
    }));
};

// Default story with sample data
export const Default: Story = {
    args: {
        userArts: generateRandomUserArts(6),
        userName: "Michael Scott",
        userAvatar: "https://github.com/shadcn.png",
        companyName: "Jammin' Art",
        sidebarDefaultOpen: true,
    },
};

// Story for empty gallery scenario
export const EmptyGallery: Story = {
    args: {
        userArts: [],
        userName: "Dwight Schrute",
        userAvatar: "",
        companyName: "Schrute Farms",
        sidebarDefaultOpen: true,
    },
};