import type { Meta, StoryObj } from '@storybook/react';
import Controllers from '@/components/art-components/Controllers';
import { useState } from "react";
import { ArtWork, generateRandomArt } from '@/services/artService';

const meta: Meta<typeof Controllers> = {
    title: 'Components/Controllers',
    component: Controllers,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        art: {
            control: 'object',
            description: 'The current art object',
        },
        setArt: {
            action: 'setArt',
            description: 'Function to update the art object',
        },
        initialArt: {
            control: 'object',
            description: 'The initial art object',
        },
        handlePublish: {
            action: 'handlePublish',
            description: 'Function to publish the art',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Controllers>;

const defaultArt: ArtWork = generateRandomArt();

export const Default: Story = {
    render: (args) => {
        const [art, setArt] = useState<ArtWork>(args.art);

        return (
            <Controllers
                art={art}
                setArt={setArt}
                initialArt={args.initialArt}
                handlePublish={() => {
                    args.handlePublish();
                    console.log('Art published:', art);
                }}
            />
        );
    },
    args: {
        art: defaultArt,
        setArt: () => { },
        initialArt: defaultArt,
        handlePublish: () => { },
    },
};

