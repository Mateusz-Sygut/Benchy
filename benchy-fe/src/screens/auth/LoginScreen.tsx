import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  StatusBar,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { screenStyles } from '../../styles/screens';
import { 
  PlantAnimations, 
  BackgroundPlants, 
  ParticleEffects, 
  AnimatedBackground,
  RandomLeaves 
} from '../../components/common/AnimationSystem';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { t } = useTranslation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('common.error'), t('auth.fillAllFields'));
      return;
    }

    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        Alert.alert(t('auth.loginError'), error.message);
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('auth.unexpectedError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground
        source={require('../../../assets/header1.jpg')}
        style={screenStyles.authBackground}
        resizeMode="cover"
        imageStyle={screenStyles.authBackgroundStyle}
      >
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0.7)']}
          style={screenStyles.authGradient}
        >
        <AnimatedBackground />
        <BackgroundPlants />
        <PlantAnimations variant="login" />
        <ParticleEffects />
        <RandomLeaves />
          <KeyboardAvoidingView 
            style={screenStyles.authContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView 
              contentContainerStyle={screenStyles.authScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={screenStyles.authHeader}>
                <Text style={screenStyles.authTitle}>
                  {t('auth.loginTitle')}
                </Text>
                <Text style={screenStyles.authDescription}>
                  {t('auth.loginSubtitle')}
                </Text>
              </View>

              <View style={screenStyles.authFormContainer}>
                <View style={screenStyles.authCard}>
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

                  <Button
                    title={loading ? t('common.loading') : t('auth.login')}
                    onPress={handleLogin}
                    loading={loading}
                    disabled={loading}
                    style={screenStyles.authButton}
                  />

                  <Button
                    title={t('auth.noAccount')}
                    variant="outline"
                    onPress={() => navigation.navigate('Register')}
                    style={screenStyles.authSecondaryButton}
                  />
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
      </ImageBackground>
    </>
  );
};


export default LoginScreen;