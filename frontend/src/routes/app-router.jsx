import React, { Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../components/layout/app-layout';
import { FEATURE_ROUTES } from './route-config';
import { getDefaultRoutePath } from './route-utils';

function AppRouter() {
  const defaultPath = getDefaultRoutePath();

  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route element={<AppLayout />}>
            {FEATURE_ROUTES.map((route) => {
              const RouteComponent = route.component;

              return <Route key={route.key} path={route.path} element={<RouteComponent />} />;
            })}
            <Route path="*" element={<Navigate to={defaultPath} replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRouter;
