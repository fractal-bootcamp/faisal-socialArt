import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import PageSidebar from './components/web-pages/PageSideBar';

interface AppProps {
  userName: string;
  userAvatar: string;
  companyName: string;
}

const App: React.FC<AppProps> = ({
  userName,
  userAvatar,
  companyName
}) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex">
        <PageSidebar userName={userName} userAvatar={userAvatar} companyName={companyName} />
        <main className="flex-grow relative">
          <SidebarTrigger className="absolute top-4 left-4 z-10" />
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default App;