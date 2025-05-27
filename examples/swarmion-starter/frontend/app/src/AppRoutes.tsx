import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { NotFound } from 'components';
import { RoutePaths } from 'types';

const Home = React.lazy(() => import('pages/Home/Home'));

const AppRoutes = (): React.JSX.Element => (
  <Suspense fallback={<NotFound />}>
    <BrowserRouter>
      <Routes>
        <Route path={RoutePaths.HOME_PAGE} element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </Suspense>
);

export default AppRoutes;
