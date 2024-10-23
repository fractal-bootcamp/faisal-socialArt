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

// Function to generate random user arts with like count
const generateRandomUserArts = (count: number): ArtType[] => {
    return Array.from({ length: count }, (_, index) => {
        const randomArt = generateRandomArt();
        return {
            ...randomArt,
            id: `${index + 1}`,
            // Ensure likeCount is included in the ArtType
            likeCount: Math.floor(Math.random() * 100), // Random like count between 0 and 99
        };
    });
};

// Default story with sample data including like counts
export const Default: Story = {
    args: {
        userArts: generateRandomUserArts(12),
        userName: "Michael Scott",
        userAvatar: "https://github.com/shadcn.png",
    },
};

// Story for empty gallery scenario
export const EmptyGallery: Story = {
    args: {
        userArts: [],
        userName: "Dwight Schrute",
        userAvatar: "",
    },
};

// Comment: We've ensured that likeCount is explicitly added to each art object.
// However, make sure that the ArtType interface in artService.ts includes likeCount as a property.
// If it doesn't, update the interface to include: likeCount?: number;