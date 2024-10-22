import type { Meta, StoryObj } from '@storybook/react';
import FeedPost from '../components/FeedPost';
import { ArtType } from '@/services/artService';

const meta: Meta<typeof FeedPost> = {
    title: 'Components/FeedPost',
    component: FeedPost,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        art: { control: 'object' },
        userAvatar: { control: 'text' },
        userName: { control: 'text' },
        isAuthor: { control: 'boolean' },
        onLike: { action: 'liked' },
        onEdit: { action: 'edited' },
        onDelete: { action: 'deleted' },
    },
};

export default meta;
type Story = StoryObj<typeof FeedPost>;

const sampleArt: ArtType = {
    id: '1',
    colorA: { h: 100, s: 90, b: 100 },
    colorB: { h: 250, s: 80, b: 20 },
    stripeCount: 12,
    userName: 'Michael Scott',
    isAuthor: false,
    style: 'line',
};

export const Default: Story = {
    args: {
        art: sampleArt,
        userAvatar: 'https://github.com/shadcn.png',
        userName: 'Michael Scott',
        isAuthor: false,
    },
};

export const AsAuthorAndNoAvatar: Story = {
    args: {
        ...Default.args,
        userAvatar: '',
        isAuthor: true,
    },
};

export const DefaultAndNoAvatar: Story = {
    args: {
        ...Default.args,
        userAvatar: "",
        userName: "Dwight Schrute",
        art: { ...sampleArt, style: 'circle' },
    },
};
