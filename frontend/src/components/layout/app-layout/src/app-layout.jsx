import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import {
  MechCommandInput,
  MechFrame,
  MechLogConsole,
  MechPanel,
  MechSidebar,
  MechTopbar
} from '../../../common';
import { getRouteByPath, getSidebarNavItems } from '../../../../routes';
import './app-layout.scss';

const logs = [
  'Initializing Adeptus Mechanicus cogitator interface...',
  'Establishing connection to Noosphere data repositories...',
  'Clearance level verified: Tech-Priest Ascendant',
  'Machine-spirit status: compliant'
];

function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navItems = getSidebarNavItems();
  const activeRoute = getRouteByPath(location.pathname);

  return (
    <main className="app-shell">
      <div className="app-shell__chassis">
        <div className="app-shell__bezel" />
        <div className="app-shell__screen">
          <MechFrame sidebarCollapsed={sidebarCollapsed}>
            <MechTopbar
              title="Adeptus Mechanicus"
              subtitle="Noosphere Terminal"
              mode="Developer Mode: Logged in as Tech-Priest"
            />

            <MechSidebar
              title="Cogitator Interface"
              items={navItems}
              activePath={activeRoute.path}
              collapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
            />

            <section className="workspace">
              <div className="workspace__feature">
                <Outlet />
              </div>

              {activeRoute.showSupportPanels ? (
                <div className="workspace__aux">
                  <MechPanel className="workspace__servo" title="Machine Spirit Link">
                    <p>Servo-skull unit online. At your service.</p>
                  </MechPanel>
                  <MechLogConsole lines={logs} />
                  <MechCommandInput />
                </div>
              ) : null}
            </section>
          </MechFrame>
        </div>
      </div>
    </main>
  );
}

export default AppLayout;
