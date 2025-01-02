// components
import HomePage from './pages/HomePage';
import MainLayout from "./layouts/MainLayout"
import PostDetailsPage from './pages/PostDetailsPage';

// styles
import './App.css'

// action creators
import { restoreSession } from "./features/user/user-slice.ts";

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
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { IsEditPostOpenProvider } from './common/contexts/IsEditPostOpenContext.tsx';
import { IsDeletePostOpenProvider } from './common/contexts/IsDeletePostOpen.tsx';
import { IsDeleteCommentOpenProvider } from './common/contexts/IsDeleteCommentOpen.tsx';

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
  const dispatch = useDispatch();

  // during app render, restore user session first.
  // Ie. set the `user` states first.
  useEffect(() => {
    // dispatch restoreSession action
    dispatch(restoreSession())
  }, [dispatch])

  return (
    <IsLoginOpenProvider>
      <IsCreateOpenProvider>      
        <IsEditPostOpenProvider>
          <IsDeletePostOpenProvider>
            <IsDeleteCommentOpenProvider>
              <RouterProvider router={router} />
            </IsDeleteCommentOpenProvider>
          </IsDeletePostOpenProvider>
        </IsEditPostOpenProvider>
      </IsCreateOpenProvider>
    </IsLoginOpenProvider>
  );
}

export default App
