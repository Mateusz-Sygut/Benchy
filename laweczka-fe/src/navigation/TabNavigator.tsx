import React from 'react';
import { PanelNavigator } from '../components/navigation/PanelNavigator';
import { UserPanel } from '../components/panels/UserPanel';
import { BenchPanel } from '../components/panels/BenchPanel';
import { NearbyBenchesPanel } from '../components/panels/NearbyBenchesPanel';
import MapScreen from '../screens/MapScreen';

const TabNavigator = () => {
  return (
    <PanelNavigator
      leftPanel={<UserPanel />}
      rightPanel={<BenchPanel />}
      bottomPanel={<NearbyBenchesPanel />}
    >
      <MapScreen />
    </PanelNavigator>
  );
};

export default TabNavigator;

