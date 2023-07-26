import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import SetAvatar from '../components/SetAvatar';

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
  {
    path: '/setAvatar',
    element: <SetAvatar />,
  },
]);

export default router;
