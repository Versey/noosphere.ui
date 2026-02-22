import { FEATURE_ROUTES } from './route-config';
import { ROUTE_PATHS } from './route-constants';

export function getSidebarNavItems() {
  return FEATURE_ROUTES.map((route) => ({
    key: route.key,
    label: route.label,
    path: route.path
  }));
}

export function getDefaultRoutePath() {
  return ROUTE_PATHS.HOME;
}

export function getRouteByPath(pathname) {
  return FEATURE_ROUTES.find((route) => route.path === pathname) || FEATURE_ROUTES[0];
}

export function goToRoute(navigate, path) {
  navigate(path);
}
