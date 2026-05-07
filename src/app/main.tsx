import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import '../styles/index.css';

import { Root } from './pages/Root';
import { Home } from './pages/Home';
import { TouristSpots } from './pages/TouristSpots';
import { AboutPage } from './pages/AboutPage';
import { CulturePage } from './pages/CulturePage';
import { EventsPage } from './pages/EventsPage';
import { TravelGuidePage } from './pages/TravelGuidePage';
import { MapPage } from './pages/MapPage';
import { ContactPage } from './pages/ContactPage';

function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl font-extrabold text-gray-200 mb-4">404</div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Page Not Found
      </h2>

      <p className="text-gray-500 mb-6">
        The page you're looking for doesn't exist.
      </p>

      <a
        href="/"
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
      >
        Back to Home
      </a>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'tourist-spots', Component: TouristSpots },
      { path: 'about', Component: AboutPage },
      { path: 'culture', Component: CulturePage },
      { path: 'events', Component: EventsPage },
      { path: 'travel-guide', Component: TravelGuidePage },
      { path: 'map', Component: MapPage },
      { path: 'contact', Component: ContactPage },
      { path: '*', Component: NotFound },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>


    <RouterProvider router={router} />
  </React.StrictMode>
);