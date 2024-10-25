import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import ProfilePage from './components/web-pages/ProfilePage'
import RootLayout from './RootLayout'
import Feed from './components/art-components/Feed'

const userName = "Faisal Owimer"
const userAvatar = "https://github.com/faisalowimer.png"
const companyName = "Jammin"

// Define the router configuration
const router = createBrowserRouter([

  {
    path: "/",
    element:
      <RootLayout userName={userName} userAvatar={userAvatar} companyName={companyName} />,
    children: [
      {
        path: "art-feed",
        element: <Feed userName={""} userAvatar={""} />
      },
      {
        path: "profile",
        element: <ProfilePage userArts={[]} userName={""} userAvatar={""} />
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
