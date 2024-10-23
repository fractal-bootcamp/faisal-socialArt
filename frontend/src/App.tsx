import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FeedPage from './components/web-pages/FeedPage';
import ProfilePage from './components/web-pages/ProfilePage';
import PageSidebar from './components/web-pages/PageSideBar';
import { SidebarProvider } from './components/ui/sidebar';

const App: React.FC = () => {
  // Mock data for demonstration purposes
  const userName = "Michael Scott";
  const userAvatar = "https://github.com/shadcn.png";
  const companyName = "Jammin' Art";

  return (
    <Router>
      <SidebarProvider>
        <div className="app-container flex">
          {/* Sidebar component */}
          <PageSidebar
            userName={userName}
            userAvatar={userAvatar}
            companyName={companyName}
          />

          <div className="content-area flex-grow">
            <Routes>
              {/* Route for the Feed Page */}
              <Route
                path="/ || /home"
                element={
                  <FeedPage
                    userName={userName}
                    userAvatar={userAvatar}
                    companyName={companyName}
                    sidebarDefaultOpen={true}
                  />
                }
              />
              {/* Separate route for /art-feed */}
              <Route
                path="/art-feed"
                element={
                  <FeedPage
                    userName={userName}
                    userAvatar={userAvatar}
                    companyName={companyName}
                    sidebarDefaultOpen={true}
                  />
                }
              />
              {/* Route for the Profile Page */}
              <Route
                path="/profile"
                element={
                  <ProfilePage
                    userArts={[]}
                    userName={userName}
                    userAvatar={userAvatar}
                    companyName={companyName}
                    sidebarDefaultOpen={true}
                  />
                }
              />
            </Routes>
          </div>
        </div>
      </SidebarProvider>
    </Router>
  );
};

export default App;