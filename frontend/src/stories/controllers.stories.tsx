import type { Meta, StoryObj } from '@storybook/react';
import Controllers from '@/components/controllers';
import { useState } from "react";

const meta: Meta<typeof Controllers> = {
    title: 'Components/Controllers',
    component: Controllers,
    tags: ['autodocs'],
    argTypes: {
        colors: {
            control: { type: 'object' },
            description: 'Array of color strings',
        },
        style: {
            control: 'radio',
            options: ['line', 'circle'],
            description: 'Style of art to generate',
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
        colors: ['#FF0000', '#00FF00'],
        style: 'line',
    },
};

export const CircleStyle: Story = {
    args: {
        colors: ['#FF0000', '#00FF00'],
        style: 'circle',
    },
};

export const CustomColors: Story = {
    args: {
        colors: ['#FF00FF', '#00FFFF'],
        style: 'line',
    },
};

export const WithControls: Story = {
    args: {
        colors: ['#FF0000', '#00FF00'],
        style: 'line',
    },
    render: (args) => {
        const [colorA, setColorA] = useState<{ h: number, s: number, b: number }>({ h: 100, s: 90, b: 100 });
        const [colorB, setColorB] = useState<{ h: number, s: number, b: number }>({ h: 250, s: 80, b: 20 });
        const [stripeCount, setStripeCount] = useState<number>(12);
        const [selectedStyle, setSelectedStyle] = useState<"line" | "circle">(args.style);

        return (
            <Controllers
                {...args}
                colors={[`hsl(${colorA.h}, ${colorA.s}%, ${colorA.b}%)`, `hsl(${colorB.h}, ${colorB.s}%, ${colorB.b}%)`]}
                style={selectedStyle}
            />
        );
    },
};
