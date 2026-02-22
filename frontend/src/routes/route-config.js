import { lazy } from 'react';
import { ROUTE_KEYS, ROUTE_PATHS } from './route-constants';

const Dashboard = lazy(() => import('../components/dashboard'));
const MindMapper = lazy(() => import('../components/mind-mapper'));

export const FEATURE_ROUTES = [
  {
    key: ROUTE_KEYS.HOME,
    path: ROUTE_PATHS.HOME,
    label: 'Main Interface',
    title: 'Noosphere Data Archives /',
    component: Dashboard,
    showSupportPanels: true
  },
  {
    key: ROUTE_KEYS.MIND_MAPPER,
    path: ROUTE_PATHS.MIND_MAPPER,
    label: 'Mind Mapper',
    title: 'Noosphere Mind Mapping Chamber /',
    component: MindMapper,
    showSupportPanels: false
  }
];
