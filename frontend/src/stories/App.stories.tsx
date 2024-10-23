import type { Meta, StoryObj } from '@storybook/react';
import App from '../App';
import { SidebarProvider } from '../components/ui/sidebar';

// Meta object for the App component
const meta: Meta<typeof App> = {
    title: 'App',
    component: App,
    // Wrap the component in necessary providers
    decorators: [
        (Story) => (
            <SidebarProvider defaultOpen={true}>
                <Story />
            </SidebarProvider>
        ),
    ],
    // Define parameters for the story
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;

// Define the Story type
type Story = StoryObj<typeof App>;

// Default story
export const Default: Story = {};

// Comment: Removed MemoryRouter to avoid nested Router issues.
// The App component should handle its own routing internally.