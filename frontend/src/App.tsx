import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import PageSidebar from './components/web-pages/PageSideBar';
import { ArtFeed, ArtType } from '@/services/artService';
import { fetchArtFeed, createArt, updateArt, deleteArt } from './services/api';

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
  const [artItems, setArtItems] = useState<ArtType[]>([]);

  useEffect(() => {
    fetchArtFeed().then(setArtItems).catch(console.error);
  }, []);

  const handleAddArt = async (newArt: ArtType) => {
    try {
      // Create new art item
      const createdArt = await createArt(newArt);
      // Update state with the new art item
      setArtItems(prevItems => [createdArt, ...prevItems]);
    } catch (error) {
      // Log the error when adding art fails
      console.error('Error adding art:', error);
    }
  };

  const handleEditArt = async (updatedArt: ArtType) => {
    try {
      const editedArt = await updateArt(updatedArt.id, updatedArt);
      setArtItems(prevItems => prevItems.map(item =>
        item.id === editedArt.id ? editedArt : item
      ));
    } catch (error) {
      console.error('Error editing art:', error);
    }
  };

  const handleDeleteArt = async (artId: string) => {
    try {
      await deleteArt(artId);
      setArtItems(prevItems => prevItems.filter(item => item.id !== artId));
    } catch (error) {
      console.error('Error deleting art:', error);
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex">
        <PageSidebar userName={userName} userAvatar={userAvatar} companyName={companyName} />
        <main className="flex-grow relative">
          <SidebarTrigger className="absolute top-4 left-4 z-10" />
          <Outlet context={{
            artItems,
            handleAddArt,
            handleEditArt,
            handleDeleteArt,
            userName,
            userAvatar,
          }} />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default App;