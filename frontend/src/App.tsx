import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FeedPage from './components/web-pages/FeedPage';
import ProfilePage from './components/web-pages/ProfilePage';
import RootLayout from './components/web-pages/RootLayout';

const App: React.FC = () => {
  // Mock data for demonstration purposes
  const userName = "Michael Scott";
  const userAvatar = "https://github.com/shadcn.png";
  const companyName = "Jammin' Art";

  return (
    <Router>
      <Routes>
        <Route element={
          <RootLayout
            userName={userName}
            userAvatar={userAvatar}
            companyName={companyName}
          />
        }>
          {/* Feed Page route */}
          <Route
            path="/"
            element={<FeedPage
              userName={userName}
              userAvatar={userAvatar}
            />}
          />
          {/* Profile Page route */}
          <Route
            path="/profile"
            element={<ProfilePage
              userName={userName}
              userAvatar={userAvatar}
              userArts={[]}
            />}
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
