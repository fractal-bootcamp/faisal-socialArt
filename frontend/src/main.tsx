import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import './index.css'
import FeedPage from './components/web-pages/FeedPage'
import ProfilePage from './components/web-pages/ProfilePage'

const userName = "Michael Scott"
const userAvatar = "https://github.com/shadcn.png"
const companyName = "Jammin'"

// Define the router configuration
const router = createBrowserRouter([

  {
    path: "/",
    element:
      <App
        userName={userName}
        userAvatar={userAvatar}
        companyName={companyName}
      />,
    children: [
      {
        path: "art-feed",
        element: <FeedPage userName={userName} userAvatar={userAvatar} handleDeleteArt={() => { }} onEditArt={() => { }} />
      },
      {
        path: "profile",
        element: <ProfilePage userName={userName} userAvatar={userAvatar} userArts={[]} />
      }
    ]
  }
]);

// Render the app with the router
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
