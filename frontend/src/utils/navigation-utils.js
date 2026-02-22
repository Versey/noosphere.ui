import { ROUTE_PATHS } from '../routes';

export function getFeatureRoutePath(featureKey) {
  const routeMap = {
    home: ROUTE_PATHS.HOME,
    mindMapper: ROUTE_PATHS.MIND_MAPPER
  };

  return routeMap[featureKey] || ROUTE_PATHS.HOME;
}

export function openFeature(navigate, featureKey) {
  navigate(getFeatureRoutePath(featureKey));
}

export function isFeatureActive(pathname, featureKey) {
  return pathname === getFeatureRoutePath(featureKey);
}
