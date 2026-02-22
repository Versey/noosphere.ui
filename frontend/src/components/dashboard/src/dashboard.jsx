import React from 'react';
import AsyncFeature from '../../common/async-feature';
import MechFolderTile from '../../common/mech-folder-tile';
import MechPanel from '../../common/mech-panel';
import './dashboard.scss';

const folders = [
  'public_records',
  'tech_updates',
  'anomalies',
  'trials',
  'scriptum_generator',
  'contributors'
];

const initDashboard = () => Promise.resolve();

function Dashboard() {
  return (
    <AsyncFeature title="Noosphere Data Archives /" init={initDashboard}>
      <MechPanel title="Noosphere Data Archives /">
        <p className="workspace__welcome">Welcome to the Adeptus Mechanicus Cogitator Terminal</p>
        <p className="workspace__access">Access level: Tech-Priest Ascendant</p>
        <div className="workspace__folders">
          {folders.map((folder) => (
            <MechFolderTile key={folder} label={folder} />
          ))}
        </div>
      </MechPanel>
    </AsyncFeature>
  );
}

export default Dashboard;
