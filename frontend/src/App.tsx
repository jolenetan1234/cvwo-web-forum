import HomePage from './pages/HomePage';
import MainLayout from "./layouts/MainLayout"
import './App.css'

import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { PostCardDetails } from './features/crud/crud-components';

// API calls here
import { getAllPosts, getPostById } from './features/crud/crud-api';

// HARDCODED
const ErrorComponent = ({ message }: { message: string}): JSX.Element => {
  return <>Error: {message}</>
}

/**
 * App router
 */
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage getAllPosts={getAllPosts}/>} />
      <Route 
      path="/post/:id" 
      element={<PostCardDetails getPostById={getPostById} ErrorComponent={ErrorComponent}/> } />
    </Route>
  )
)

function App() {
  return <RouterProvider router={router} />
}

/*
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}
*/

export default App
