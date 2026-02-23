import React, { useRef } from 'react';
import { PanelNavigator } from '../components/navigation/PanelNavigator';
import { UserPanel } from '../components/panels/UserPanel';
import { BenchPanel } from '../components/panels/BenchPanel';
import { NearbyBenchesPanel } from '../components/panels/NearbyBenchesPanel';
import MapScreen, { MapScreenRef } from '../screens/MapScreen';
import { ExtendedBench } from '../types/database';

const TabNavigator = () => {
  const mapRef = useRef<MapScreenRef>(null);

  const handleBenchPress = (bench: ExtendedBench) => {
    if (mapRef.current) {
      mapRef.current.focusOnBench(bench);
    }
  };

  return (
    <PanelNavigator
      leftPanel={<UserPanel />}
      rightPanel={<BenchPanel />}
      bottomPanel={<NearbyBenchesPanel onBenchPress={handleBenchPress} />}
    >
      <MapScreen ref={mapRef} />
    </PanelNavigator>
  );
};

export default TabNavigator;

