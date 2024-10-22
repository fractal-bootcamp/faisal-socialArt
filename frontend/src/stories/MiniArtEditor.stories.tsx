import type { Meta, StoryObj } from '@storybook/react';
import MiniArtEditor from '../components/art-components/MiniArtEditor';
import { ArtType } from '@/services/artService';

const meta: Meta<typeof MiniArtEditor> = {
    title: 'Components/MiniArtEditor',
    component: MiniArtEditor,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        initialArt: { control: 'object' },
        publishArt: { action: 'published' },
        userAvatar: { control: 'text' },
        userName: { control: 'text' },
        onClose: { action: 'closed' },
    },
};

export default meta;
type Story = StoryObj<typeof MiniArtEditor>;

const defaultArt: ArtType = {
    id: '1',
    colorA: { h: 0, s: 100, b: 100 },
    colorB: { h: 240, s: 100, b: 100 },
    stripeCount: 5,
    userName: 'Michael Scott',
    isAuthor: true,
    style: 'line',
};

export const Default: Story = {
    args: {
        initialArt: defaultArt,
        userAvatar: 'https://example.com/avatar.jpg',
        userName: 'Michael Scott',
        onClose: () => { },
        publishArt: () => { },
    },
};

export const OpenEdit: Story = {
    args: {
        initialArt: defaultArt,
        userAvatar: 'https://example.com/avatar.jpg',
        userName: 'Michael Scott',
        onClose: () => { },
        publishArt: () => { },
    },
    parameters: {
        initialState: { isOpen: true },
    },
};
