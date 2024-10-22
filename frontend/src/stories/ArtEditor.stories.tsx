import type { Meta, StoryObj } from '@storybook/react';
import ArtEditor from '../components/ArtEditor';
import { ArtWork } from '@/services/artService';

const meta: Meta<typeof ArtEditor> = {
    title: 'Components/ArtEditor',
    component: ArtEditor,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        initialArt: {
            control: 'object',
        },
        publishArt: { action: 'published' },
    },
};

export default meta;
type Story = StoryObj<typeof ArtEditor>;

const defaultArt: ArtWork = {
    id: '', // Add an empty string as the default id
    colorA: { h: 0, s: 100, b: 100 },
    colorB: { h: 240, s: 100, b: 100 },
    stripeCount: 5,
    style: 'line',
};

export const Default: Story = {
    args: {
        initialArt: defaultArt,
    },
};

export const CircleStyle: Story = {
    args: {
        initialArt: { ...defaultArt, style: 'circle' },
    },
};

export const ManyStripes: Story = {
    args: {
        initialArt: { ...defaultArt, stripeCount: 20 },
    },
};
