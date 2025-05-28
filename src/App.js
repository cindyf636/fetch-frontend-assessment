import LoginPage from './Components/LoginPage/Login';
import { createHashRouter, createRoutesFromElements, Route } from 'react-router-dom';
import { RouterProvider } from 'react-router-dom';
import SearchPage from './Components/SearchPage/SearchPage';
import MatchPage from './Components/MatchPage/MatchPage';

function App() {
  return <RouterProvider router={router} />;
}

const router = createHashRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<LoginPage />} />
      <Route path='/search' element={<SearchPage />} />
      <Route path="/match/:dogId" element={<MatchPage />} />
    </>
  )
);
export default App;
