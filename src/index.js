import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import './i18n.js';

import Layout from './page/layout.js';
import InfoMap from './page/infoMap/infoMap.js';
import TreasureMap from './page/treasureMap/treasureMap.js';
import DamageCalc from './page/DamageCalc/damageCalc.js';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <InfoMap /> },
      { path: "/map", element: <InfoMap /> },
      { path: "/treasure", element: <TreasureMap /> },
      { path: "/damage", element: <DamageCalc /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router}>
      <Layout />
  </RouterProvider>
);
