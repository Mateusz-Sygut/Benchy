import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common/Button';
import { screenStyles } from '../styles/screens';
import { commonStyles } from '../styles/common';

const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  const { t } = useTranslation();

  const handleSignOut = () => {
    Alert.alert(
      t('auth.logout'),
      t('profile.logoutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('auth.logout'), style: 'destructive', onPress: signOut },
      ]
    );
  };

  const menuItems = [
    {
      icon: 'map-outline',
      title: t('profile.myBenches'),
      subtitle: t('profile.myBenchesSubtitle'),
      onPress: () => {
      },
    },
    {
      icon: 'star-outline',
      title: t('profile.myRatings'),
      subtitle: t('profile.myRatingsSubtitle'),
      onPress: () => {
      },
    },
    {
      icon: 'settings-outline',
      title: t('profile.settings'),
      subtitle: t('profile.settingsSubtitle'),
      onPress: () => {
      },
    },
    {
      icon: 'help-circle-outline',
      title: t('profile.help'),
      subtitle: t('profile.helpSubtitle'),
      onPress: () => {
      },
    },
  ];

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#2e7d32" />
      <ScrollView style={screenStyles.profileContainer}>
        {/* Header with Gradient */}
        <LinearGradient
          colors={['#2e7d32', '#388e3c', '#43a047']}
          style={screenStyles.profileHeader}
        >
          <View style={screenStyles.profileProfileSection}>
            <View style={screenStyles.profileAvatarContainer}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                style={screenStyles.profileAvatar}
              >
                <Ionicons name="person" size={40} color="#fff" />
              </LinearGradient>
            </View>
            <Text style={screenStyles.profileUserName}>
              {user?.user_metadata?.username || t('profile.user')}
            </Text>
            <Text style={screenStyles.profileUserEmail}>
              {user?.email}
            </Text>
          </View>
        </LinearGradient>

        {/* Stats Card */}
        <View style={screenStyles.profileStatsCard}>
          <View style={screenStyles.profileStatItem}>
            <Text style={screenStyles.profileStatNumber}>0</Text>
            <Text style={screenStyles.profileStatLabel}>
              {t('profile.addedBenches')}
            </Text>
          </View>
          <View style={screenStyles.profileStatDivider} />
          <View style={screenStyles.profileStatItem}>
            <Text style={screenStyles.profileStatNumber}>0</Text>
            <Text style={screenStyles.profileStatLabel}>
              {t('profile.givenRatings')}
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={screenStyles.profileMenuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                screenStyles.profileMenuItem,
                index < menuItems.length - 1 && screenStyles.profileMenuItemBorder
              ]}
              onPress={item.onPress}
            >
              <View style={screenStyles.profileMenuItemContent}>
                <View style={screenStyles.profileMenuIconContainer}>
                  <Ionicons name={item.icon as any} size={24} color="#2e7d32" />
                </View>
                <View style={screenStyles.profileMenuTextContainer}>
                  <Text style={screenStyles.profileMenuTitle}>
                    {item.title}
                  </Text>
                  <Text style={screenStyles.profileMenuSubtitle}>
                    {item.subtitle}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View style={screenStyles.profileLogoutContainer}>
          <Button
            title={t('auth.logout')}
            variant="danger"
            onPress={handleSignOut}
            icon="log-out-outline"
          />
        </View>
      </ScrollView>
    </>
  );
};


export default ProfileScreen;