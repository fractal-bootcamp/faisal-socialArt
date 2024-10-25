import type { Meta, StoryObj } from '@storybook/react';
import RootLayout from '../RootLayout';
import { SidebarProvider } from '../components/ui/sidebar';
import { BrowserRouter } from 'react-router-dom';

// Meta object for the App component
const meta: Meta<typeof RootLayout> = {
    title: 'App',
    component: RootLayout,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;

// Define the Story type
type Story = StoryObj<typeof RootLayout>;

// Default story with props matching the App component
export const Default: Story = {
    args: {
        userName: "Michael Scott",
        userAvatar: "https://github.com/shadcn.png",
        companyName: "Jammin' Art"
    },
    // Wrap the component in necessary providers
    decorators: [
        (Story) => (
            <BrowserRouter>
                <SidebarProvider defaultOpen={true}>
                    <Story />
                </SidebarProvider>
            </BrowserRouter>
        ),
    ],
};
