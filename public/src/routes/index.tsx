import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';

const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Home</div>,
    errorElement: <div>Error</div>,
    children: [
      {
        index: true,
        element: <div>Hacker!</div>,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Register />,
  },
]);

export default router;
