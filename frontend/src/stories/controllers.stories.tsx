import type { Meta, StoryObj } from '@storybook/react';
import Controllers from '@/components/Controllers';
import { useState } from "react";

const meta: Meta<typeof Controllers> = {
    title: 'Components/Controllers',
    component: Controllers,
    tags: ['autodocs'],
    argTypes: {
        style: {
            control: 'radio',
            options: ['line', 'circle'],
            description: 'Style of art to generate',
        },
        colorA: {
            control: 'object',
        },
        colorB: {
            control: 'object',
        },
        stripeCount: {
            control: { type: 'range', min: 2, max: 50, step: 1 },
        },
    },
    decorators: [
        (Story) => (
            <div style={{ margin: '3em' }}>
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof Controllers>;

export const Default: Story = {
    args: {
        colorA: { h: 100, s: 90, b: 100 },
        colorB: { h: 250, s: 80, b: 20 },
        stripeCount: 12,
        style: 'line',
        onColorAChange: () => { },
        onColorBChange: () => { },
        onStripeCountChange: () => { },
        onStyleChange: () => { },
    },
};

export const CircleStyle: Story = {
    args: {
        ...Default.args,
        style: 'circle',
    },
};

export const WithControls: Story = {
    args: {
        ...Default.args,
    },
    render: (args) => {
        const [colorA, setColorA] = useState<{ h: number, s: number, b: number }>(args.colorA);
        const [colorB, setColorB] = useState<{ h: number, s: number, b: number }>(args.colorB);
        const [stripeCount, setStripeCount] = useState<number>(args.stripeCount);
        const [style, setStyle] = useState<"line" | "circle">(args.style);

        return (
            <Controllers
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
}