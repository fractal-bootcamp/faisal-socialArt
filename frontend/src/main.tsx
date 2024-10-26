import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import ProfilePage from './components/web-pages/ProfilePage'
import RootLayout from './RootLayout'
import Feed from './components/art-components/Feed'
import { ClerkProvider } from '@clerk/clerk-react'

const companyName = "Jammin'"

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key.");
}

// Define the router configuration
const router = createBrowserRouter([

  {
    path: "/",
    element:
      <RootLayout companyName={companyName} />,
    children: [
      {
        path: "art-feed",
        element: <Feed />
      },
      {
        path: "profile",
        element: <ProfilePage />
      }
    ]
  }
]);

// Render the app with the router
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <RouterProvider router={router} />
    </ClerkProvider>
  </React.StrictMode>
)
