import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { registrationErrorKey } from '../../lib/authErrors';
import { rememberPendingEmailConfirm } from '../../lib/emailConfirm';
import { generateRandomNickname } from '../../lib/displayName';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useThemedStyles } from '../../hooks/useThemedStyles';

const RegisterScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { t } = useTranslation();
  const { screen: screenStyles } = useThemedStyles();
  const insets = useSafeAreaInsets();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !username) {
      Alert.alert(t('common.error'), t('auth.fillAllFields'));
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(t('common.error'), t('auth.passwordsDontMatch'));
      return;
    }

    if (password.length < 6) {
      Alert.alert(t('common.error'), t('auth.passwordTooShort'));
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedUsername = username.trim();

    setLoading(true);
    try {
      const [{ data: emailOwner }, { data: nicknameOwner }] = await Promise.all([
        supabase.from('users').select('id').eq('email', trimmedEmail).maybeSingle(),
        supabase.from('users').select('id').eq('username', trimmedUsername).maybeSingle(),
      ]);

      if (emailOwner) {
        Alert.alert(t('auth.registerError'), t('auth.emailTaken'));
        return;
      }
      if (nicknameOwner) {
        Alert.alert(t('auth.registerError'), t('auth.usernameTaken'));
        return;
      }

      const { data, error } = await signUp(trimmedEmail, password, trimmedUsername);
      if (error) {
        Alert.alert(t('auth.registerError'), t(registrationErrorKey(error)));
      } else {
        if (!data.session) {
          await rememberPendingEmailConfirm(trimmedEmail);
        }
        Alert.alert(t('common.success'), t('auth.accountCreated'), [
          { text: t('common.ok'), onPress: () => navigation.navigate('Login') },
        ]);
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('auth.unexpectedError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={screenStyles.authContainer}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={screenStyles.authContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[
            screenStyles.authScrollContent,
            { paddingBottom: Math.max(insets.bottom, 12) + 12 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={screenStyles.authHeader}>
            <Text style={screenStyles.authTitle}>{t('auth.registerTitle')}</Text>
            <Text style={screenStyles.authDescription}>{t('auth.registerSubtitle')}</Text>
          </View>

          <View style={screenStyles.authFormContainer}>
            <View style={screenStyles.authCard}>
              <View style={screenStyles.authUsernameRow}>
                <Input
                  placeholder={t('common.username')}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                  icon="person-outline"
                  containerStyle={[screenStyles.authInputContainer, screenStyles.authUsernameInput]}
                />
                <TouchableOpacity
                  style={screenStyles.authRandomNicknameButton}
                  onPress={() => setUsername(generateRandomNickname())}
                  activeOpacity={0.7}
                >
                  <Text style={screenStyles.authRandomNicknameButtonText}>
                    {t('auth.randomNickname')}
                  </Text>
                </TouchableOpacity>
              </View>

              <Input
                placeholder={t('common.email')}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                icon="mail-outline"
                containerStyle={screenStyles.authInputContainer}
              />

              <Input
                placeholder={t('common.password')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                icon="lock-closed-outline"
                containerStyle={screenStyles.authInputContainer}
              />

              <Input
                placeholder={t('auth.confirmPassword')}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                icon="lock-closed-outline"
                containerStyle={screenStyles.authInputContainer}
              />

              <Button
                title={loading ? t('common.loading') : t('auth.register')}
                onPress={handleRegister}
                loading={loading}
                disabled={loading}
                style={screenStyles.authButton}
              />

              <Button
                title={t('auth.haveAccount')}
                variant="outline"
                onPress={() => navigation.navigate('Login')}
                style={screenStyles.authSecondaryButton}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterScreen;
