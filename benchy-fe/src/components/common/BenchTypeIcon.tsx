import React from 'react';
import { Image, Text, StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { getBenchTypeIconSource } from '../../lib/benchTypeIcons';

type BenchTypeIconProps = {
  typeName?: string | null;
  emojiFallback?: string | null;
  size?: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export const BenchTypeIcon: React.FC<BenchTypeIconProps> = ({
  typeName,
  emojiFallback = '🪑',
  size = 32,
  style,
  textStyle,
}) => {
  const source = getBenchTypeIconSource(typeName);

  if (source) {
    return (
      <View style={[{ width: size, height: size }, style]}>
        <Image
          source={source}
          style={{ width: size, height: size }}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <Text style={[{ fontSize: size * 0.9 }, textStyle]}>
      {emojiFallback || '🪑'}
    </Text>
  );
};
