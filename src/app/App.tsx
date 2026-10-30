import { createHashRouter, RouterProvider } from 'react-router';
import { Shell } from './Shell';
import { HomeScreen } from '../features/home/HomeScreen';

const router = createHashRouter([
  {
    path: '/',
    element: <Shell />,
    children: [{ index: true, element: <HomeScreen /> }],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
