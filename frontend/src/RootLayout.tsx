"use client";
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import PageSidebar from './components/web-pages/PageSideBar';
// import { useAuth } from '@clerk/clerk-react';

interface RootLayoutProps {
  companyName: string;
}

const RootLayout: React.FC<RootLayoutProps> = ({
  companyName
}) => {
  // const { isSignedIn, isLoaded } = useAuth();

  // console.log('isSignedIn:', isSignedIn);

  // if (!isSignedIn || !isLoaded) {
  //   return null;
  // }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex">
        <PageSidebar companyName={companyName} />
        <main className="flex-grow relative">
          <SidebarTrigger className="absolute top-4 left-4 z-10" />
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default RootLayout;
