import type { Meta, StoryObj } from '@storybook/react';
import FeedItem from '../components/ArtEditor';
import { useState } from "react";

const meta: Meta<typeof FeedItem> = {
    title: 'Components/FeedItem',
    component: FeedItem,
    tags: ['autodocs'],
    argTypes: {
        colorA: {
            control: 'object',
        },
        colorB: {
            control: 'object',
        },
        stripeCount: {
            control: { type: 'range', min: 2, max: 50, step: 1 },
        },
        style: {
            control: 'radio',
            options: ['line', 'circle'],
        },
    },
};

export default meta;
type Story = StoryObj<typeof FeedItem>;

export const Default: Story = {
    args: {
        colorA: { h: 100, s: 90, b: 100 },
        colorB: { h: 250, s: 80, b: 20 },
        stripeCount: 12,
        style: 'line',
    },
};

export const CircleStyle: Story = {
    args: {
        ...Default.args,
        style: 'circle',
    },
};

export const WithInteractiveControls: Story = {
    render: (args) => {
        const [colorA, setColorA] = useState(args.colorA);
        const [colorB, setColorB] = useState(args.colorB);
        const [stripeCount, setStripeCount] = useState(args.stripeCount);
        const [style, setStyle] = useState(args.style);

        return (
            <FeedItem
                colorA={colorA}
                colorB={colorB}
                stripeCount={stripeCount}
                style={style}
                onColorAChange={setColorA}
                onColorBChange={setColorB}
                onStripeCountChange={setStripeCount}
                onStyleChange={setStyle}
            />
        );
    },
    args: Default.args,
};
