import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import PageSidebar from '../components/web-pages/PageSideBar';
import { SidebarProvider } from '@/components/ui/sidebar'; // Import SidebarProvider

// Define the meta object for the PageSidebar component
const meta: Meta<typeof PageSidebar> = {
    title: 'Components/PageSidebar',
    component: PageSidebar,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <BrowserRouter>
                <SidebarProvider> {/* Wrap Story with SidebarProvider */}
                    <Story />
                </SidebarProvider>
            </BrowserRouter>
        ),
    ],
    argTypes: {
        userName: { control: 'text' },
        userAvatar: { control: 'text' },
        companyName: { control: 'text' },
    },
};

export default meta;
type Story = StoryObj<typeof PageSidebar>;

// Define the default story
export const Default: Story = {
    args: {
        userName: 'Michael Scott',
        userAvatar: 'https://github.com/shadcn.png',
        companyName: 'Dunder Mifflin',
    },
};

// Define a story with a long company name
export const LongCompanyName: Story = {
    args: {
        ...Default.args,
        userName: 'Very Long Company Name That Might Wrap',
        companyName: 'Very Long Company Name That Might Wrap',
    },
};


// Define a story with no avatar image
export const NoAvatarImage: Story = {
    args: {
        ...Default.args,
        userAvatar: '',
    },
};