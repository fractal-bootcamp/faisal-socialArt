import type { Meta, StoryObj } from '@storybook/react';
import ArtEditor from '../components/art-components/ArtEditor';
import { ArtWork } from '@/services/artService';

const meta: Meta<typeof ArtEditor> = {
    title: 'Components/ArtEditor',
    component: ArtEditor,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        initialArt: { control: 'object' },
        publishArt: { action: 'published' },
        onClose: { action: 'closed' },
        userAvatar: { control: 'text' },
        userName: { control: 'text' },
    },
};

export default meta;
type Story = StoryObj<typeof ArtEditor>;

const defaultArt: ArtWork = {
    id: '1',
    userName: '',
    userAvatar: '',
    authorId: '',
    isAuthor: false,
    colorA: { h: 0, s: 100, b: 100 },
    colorB: { h: 240, s: 100, b: 100 },
    stripeCount: 5,
    style: 'line',
};

export const Default: Story = {
    args: {
        initialArt: defaultArt,
        userAvatar: 'https://github.com/shadcn.png',
        userName: 'Michael Scott',
    },
};

export const CircleStyle: Story = {
    args: {
        initialArt: { ...defaultArt, style: 'circle' },
        userAvatar: '',
        userName: 'Dwight Schrute',
    },
};