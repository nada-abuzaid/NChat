import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import SetAvatar from '../components/SetAvatar';
import Contacts from '../components/Contacts';
import { Chat } from '../pages/Chat';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Chat />,
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
