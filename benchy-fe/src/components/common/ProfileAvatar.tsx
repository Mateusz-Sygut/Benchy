import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles } from '../../hooks/useThemedStyles';

function imageUri(uri: string): string {
  if (!uri.startsWith('http://') && !uri.startsWith('https://')) {
    return uri;
  }
  const query = uri.indexOf('?');
  return query === -1 ? uri : uri.slice(0, query);
}

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
  const placeholderColor = variant === 'onPrimary' ? '#ffffff' : theme.primary[100];
  const placeholderIconColor = theme.primary[800];

  const content = (
    <View style={[{ width: size, height: size }, style]}>
      <View
        collapsable={false}
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          overflow: 'hidden',
          backgroundColor: placeholderColor,
        }}
      >
        <View
          style={{
            width: size,
            height: size,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ionicons name="person" size={size * 0.5} color={placeholderIconColor} />
        </View>
        {avatarUrl ? (
          <Image
            key={avatarUrl}
            source={{ uri: imageUri(avatarUrl) }}
            style={{ position: 'absolute', top: 0, left: 0, width: size, height: size }}
            resizeMode="cover"
            fadeDuration={0}
          />
        ) : null}

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
      </View>

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