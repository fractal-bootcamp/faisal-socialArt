import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

import App from './App'
import RootLayout from './components/web-pages/RootLayout'
import FeedPage from './components/web-pages/FeedPage'
import ProfilePage from './components/web-pages/ProfilePage'

const router = createBrowserRouter([
  {
    element: <RootLayout userName="" userAvatar="" companyName="" />,
    children: [
      {
        path: "/",
        element: <FeedPage
          userName=""
          userAvatar=""
          companyName=""
          sidebarDefaultOpen={false}
        />
      },
      {
        path: "/profile",
        element: <ProfilePage
          userArts={[]}
          userName=""
          userAvatar=""
          companyName=""
          sidebarDefaultOpen={false}
        />
      },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)