import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useAchievements } from './useAchievements';
import { removeProfileAvatar, uploadProfileAvatar } from '../lib/profileAvatar';

export function useProfileAvatar() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { userProfile, refreshAchievements } = useAchievements();
  const [uploading, setUploading] = useState(false);

  const avatarUrl = userProfile?.avatar_url ?? null;

  const pickAndUpload = useCallback(async () => {
    if (!user) return;

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t('common.error'), t('profile.avatarPermissionDenied'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (result.canceled || !result.assets[0]) {
      return;
    }

    const asset = result.assets[0];
    setUploading(true);
    try {
      await uploadProfileAvatar(user.id, asset.uri, asset.mimeType ?? undefined);
      await refreshAchievements();
      Alert.alert(t('common.success'), t('profile.avatarUpdated'));
    } catch (error) {
      console.error('Error uploading avatar:', error);
      Alert.alert(t('common.error'), t('profile.avatarUploadError'));
    } finally {
      setUploading(false);
    }
  }, [user, t, refreshAchievements]);

  const removeAvatar = useCallback(async () => {
    if (!user) return;

    setUploading(true);
    try {
      await removeProfileAvatar(user.id);
      await refreshAchievements();
      Alert.alert(t('common.success'), t('profile.avatarRemoved'));
    } catch (error) {
      console.error('Error removing avatar:', error);
      Alert.alert(t('common.error'), t('profile.avatarRemoveError'));
    } finally {
      setUploading(false);
    }
  }, [user, t, refreshAchievements]);

  const showAvatarOptions = useCallback(() => {
    if (uploading) return;

    const options: { text: string; style?: 'default' | 'cancel' | 'destructive'; onPress?: () => void }[] =
      [
        { text: t('profile.avatarChoose'), onPress: pickAndUpload },
      ];

    if (avatarUrl) {
      options.push({
        text: t('profile.avatarRemove'),
        style: 'destructive',
        onPress: () => {
          Alert.alert(t('profile.avatarRemove'), t('profile.avatarRemoveConfirm'), [
            { text: t('common.cancel'), style: 'cancel' },
            { text: t('profile.avatarRemove'), style: 'destructive', onPress: removeAvatar },
          ]);
        },
      });
    }

    options.push({ text: t('common.cancel'), style: 'cancel' });

    Alert.alert(t('profile.avatarTitle'), t('profile.avatarSubtitle'), options);
  }, [uploading, avatarUrl, t, pickAndUpload, removeAvatar]);

  return {
    avatarUrl,
    uploading,
    showAvatarOptions,
  };
}