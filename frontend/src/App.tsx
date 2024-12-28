// components
import HomePage from './pages/HomePage';
import MainLayout from "./layouts/MainLayout"
import PostDetailsPage from './pages/PostDetailsPage';

// styles
import './App.css'

import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

// contexts
import { IsLoginOpenProvider } from './common/contexts/IsLoginOpenContext';
import SignUpPage from './pages/SignUpPage';
import { IsCreateOpenProvider } from './common/contexts/IsCreateOpenContext';

/**
 * App router
 */
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route 
      path="/post/:id" 
      element={<PostDetailsPage /> } />
      <Route
      path="/signup"
      element={<SignUpPage />} />
    </Route>
  )
)

function App() {
  return (
    <IsLoginOpenProvider>
      <IsCreateOpenProvider>      
        <RouterProvider router={router} />
      </IsCreateOpenProvider>
    </IsLoginOpenProvider>
  );
}

export default App
