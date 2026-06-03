import React from 'react';
import { View, Image } from 'react-native';
import { getRarityColor } from '../../styles/glassmorphism';

const benchMarkerImage = require('../../../assets/bench.png');

export const BENCH_MARKER_ANCHOR = { x: 0.5, y: 1 } as const;

export const BENCH_MARKER_DEFAULT_SIZE = 22;

type BenchMapMarkerProps = {
  rarityLevel?: number;
  size?: number;
};

export const BenchMapMarker: React.FC<BenchMapMarkerProps> = ({
  rarityLevel = 1,
  size = BENCH_MARKER_DEFAULT_SIZE,
}) => {
  const ringSize = size + 6;
  const dotSize = 4;
  const markerHeight = ringSize + dotSize + 2;
  const markerWidth = ringSize;
  const rarityColor = getRarityColor(rarityLevel);

  return (
    <View
      style={{
        width: markerWidth,
        height: markerHeight,
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: ringSize,
          height: ringSize,
          borderRadius: ringSize / 2,
          backgroundColor: rarityColor,
          borderWidth: 1.5,
          borderColor: '#ffffff',
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 3,
        }}
      >
        <Image
          source={benchMarkerImage}
          style={{ width: size - 4, height: size - 4 }}
          resizeMode="contain"
        />
      </View>
      <View
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: dotSize / 2,
          backgroundColor: rarityColor,
          borderWidth: 1,
          borderColor: '#ffffff',
          marginTop: 2,
        }}
      />
    </View>
  );
};
