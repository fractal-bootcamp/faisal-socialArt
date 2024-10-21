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
        onColorAChange: {
            action: 'colorA changed',
            description: 'Callback when Color A is changed'
        },
        onColorBChange: {
            action: 'colorB changed',
            description: 'Callback when Color B is changed'
        },
        onStripeCountChange: {
            action: 'stripeCount changed',
            description: 'Callback when the number of stripes is changed'
        },
        onStyleChange: {
            action: 'style changed',
            description: 'Callback when the style is changed between line and circle'
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
    },
};

export const CircleStyle: Story = {
    args: {
        ...Default.args,
        style: 'circle',
    },
};

export const WithControls: Story = {
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
                onColorAChange={(color) => {
                    setColorA(color);
                    args.onColorAChange?.(color);
                }}
                onColorBChange={(color) => {
                    setColorB(color);
                    args.onColorBChange?.(color);
                }}
                onStripeCountChange={(count) => {
                    setStripeCount(count);
                    args.onStripeCountChange?.(count);
                }}
                onStyleChange={(newStyle) => {
                    setStyle(newStyle);
                    args.onStyleChange?.(newStyle);
                }}
            />
        );
    },
    args: Default.args,
}
