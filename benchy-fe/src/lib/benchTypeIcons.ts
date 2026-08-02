import { ImageSourcePropType } from 'react-native';

const BENCH_TYPE_ICONS: Record<string, ImageSourcePropType> = {
  wooden: require('../../assets/models/bench_wooden.png'),
  metal: require('../../assets/models/bench_metal.png'),
  stone: require('../../assets/models/bench_stone.png'),
  designer: require('../../assets/models/bench_designer.png'),
  park: require('../../assets/models/bench_park.png'),
};

export function getBenchTypeIconSource(
  typeName?: string | null
): ImageSourcePropType | null {
  if (!typeName) return null;
  return BENCH_TYPE_ICONS[typeName.toLowerCase()] ?? null;
}
