import HomePage from './pages/HomePage';
import MainLayout from "./layouts/MainLayout"
import './App.css'

import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import PostDetailsPage from './pages/PostDetailsPage';

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
    </Route>
  )
)

function App() {
  return <RouterProvider router={router} />
}

export default App
