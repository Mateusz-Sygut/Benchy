import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles } from '../../hooks/useThemedStyles';

type ProfileAvatarProps = {
  avatarUrl?: string | null;
  size?: number;
  editable?: boolean;
  uploading?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: 'onPrimary' | 'default';
};

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  avatarUrl,
  size = 80,
  editable = false,
  uploading = false,
  onPress,
  style,
  variant = 'onPrimary',
}) => {
  const { theme } = useThemedStyles();
  const radius = size / 2;
  const placeholderColors =
    variant === 'onPrimary'
      ? (['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)'] as const)
      : ([theme.gradient.light, theme.primary[200]] as const);
  const placeholderIconColor = variant === 'onPrimary' ? '#fff' : theme.primary[800];

  const content = (
    <View style={[{ width: size, height: size }, style]}>
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          style={{
            width: size,
            height: size,
            borderRadius: radius,
            backgroundColor: theme.gray[200],
          }}
        />
      ) : (
        <LinearGradient
          colors={[...placeholderColors]}
          style={{
            width: size,
            height: size,
            borderRadius: radius,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ionicons name="person" size={size * 0.5} color={placeholderIconColor} />
        </LinearGradient>
      )}

      {uploading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: size,
            height: size,
            borderRadius: radius,
            backgroundColor: 'rgba(0,0,0,0.45)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator color="#fff" />
        </View>
      )}

      {editable && !uploading && (
        <View
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: size * 0.32,
            height: size * 0.32,
            borderRadius: size * 0.16,
            backgroundColor: theme.primary[600],
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: '#fff',
          }}
        >
          <Ionicons name="camera" size={size * 0.16} color="#fff" />
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} disabled={uploading}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};