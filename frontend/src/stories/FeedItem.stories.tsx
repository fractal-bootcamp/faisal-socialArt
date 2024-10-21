import type { Meta, StoryObj } from '@storybook/react';
import FeedItem from '../components/FeedItem';

const meta: Meta<typeof FeedItem> = {
    title: 'Components/FeedItem',
    component: FeedItem,
    tags: ['autodocs'],
    argTypes: {
        colorA: { control: 'object' },
        colorB: { control: 'object' },
        stripeCount: { control: { type: 'number', min: 1, max: 100 } },
        style: { control: 'radio', options: ['line', 'circle'] },
    },
};

export default meta;
type Story = StoryObj<typeof FeedItem>;

export const Default: Story = {
    args: {
        colorA: { h: 0, s: 100, b: 100 },
        colorB: { h: 240, s: 100, b: 100 },
        stripeCount: 10,
        style: 'line',
    },
};

export const CircleStyle: Story = {
    args: {
        ...Default.args,
        style: 'circle',
    },
};

export const MoreStripes: Story = {
    args: {
        ...Default.args,
        stripeCount: 50,
    },
};

export const PastelColors: Story = {
    args: {
        ...Default.args,
        colorA: { h: 60, s: 50, b: 100 },
        colorB: { h: 180, s: 50, b: 100 },
    },
};
