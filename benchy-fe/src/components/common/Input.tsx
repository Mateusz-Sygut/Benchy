import React from 'react';
import {
  View,
  TextInput,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { componentStyles } from '../../styles/components';

interface InputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  icon?: string;
  containerStyle?: any;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
}

export const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  icon,
  containerStyle,
  error,
  multiline = false,
  numberOfLines = 1,
}) => {
  return (
    <View style={[componentStyles.inputContainer, containerStyle]}>
      <View style={componentStyles.inputWrapper}>
        {icon && (
          <View style={componentStyles.inputIconContainer}>
            <Ionicons name={icon as any} size={20} color="#666" />
          </View>
        )}
        <TextInput
          style={[
            componentStyles.input,
            icon && componentStyles.inputWithIcon,
            multiline && componentStyles.inputMultiline,
            error && componentStyles.inputError,
          ]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          multiline={multiline}
          numberOfLines={numberOfLines}
          placeholderTextColor="#999"
        />
      </View>
      {error && <Text style={componentStyles.inputErrorText}>{error}</Text>}
    </View>
  );
};

