import type { Meta, StoryObj } from '@storybook/react';
import Feed from '../components/Feed';

const meta: Meta<typeof Feed> = {
    title: 'Components/Feed',
    component: Feed,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Feed>;

const generateRandomFeedItem = () => ({
    colorA: { h: Math.random() * 360, s: Math.random() * 100, b: Math.random() * 100 },
    colorB: { h: Math.random() * 360, s: Math.random() * 100, b: Math.random() * 100 },
    stripeCount: Math.floor(Math.random() * 49) + 2,
    style: Math.random() < 0.5 ? "line" : "circle" as "line" | "circle"
});

export const EmptyFeed: Story = {
    args: {
        initialItems: [],
    },
};

export const FeedWithThreeItems: Story = {
    args: {
        initialItems: [
            generateRandomFeedItem(),
            generateRandomFeedItem(),
            generateRandomFeedItem(),
        ],
    },
};

export const InteractiveFeed: Story = {
    render: () => {
        return (
            <Feed initialItems={[
                generateRandomFeedItem(),
                generateRandomFeedItem(),
                generateRandomFeedItem(),
            ]} />
        );
    },
};
